/**
 * PREKĖS ATPAŽINIMAS IŠ PARDUOTUVĖS PUSLAPIO (AliExpress, Alibaba, Temu, eBay, Amazon ir kt.).
 * Naudojama dviejose vietose:
 *  – naršyklės mygtuke „➕ Į mano parduotuvę“ (veikia atidarytame prekės puslapyje);
 *  – importo puslapyje /admin/importas (kai įklijuojama nuoroda).
 * SVARBU: failas be importų – mygtukas surenkamas iš šio failo teksto (src/pages/admin/importas.astro).
 */

export interface ExtractedProduct {
  url: string;
  site: string;
  title: string;
  description: string;
  images: string[];
  price: number | null;
  currency: string | null;
  specs: { label: string; value: string }[];
  brand: string;
  sku: string;
}

export function parsePrice(text: unknown): { price: number | null; currency: string | null } {
  if (text === null || text === undefined) return { price: null, currency: null };
  const t = String(text).replace(/\s+/g, ' ').trim();
  let currency: string | null = null;
  const map: [RegExp, string][] = [
    [/€|\beur\b/i, 'EUR'],
    [/£|\bgbp\b/i, 'GBP'],
    [/zł|\bpln\b/i, 'PLN'],
    [/¥|\bcny\b|\brmb\b/i, 'CNY'],
    [/\$|\busd\b/i, 'USD'],
  ];
  for (const [re, c] of map) {
    if (re.test(t)) {
      currency = c;
      break;
    }
  }
  const m = t.match(/\d[\d\s.,]*/);
  if (!m) return { price: null, currency };
  let n = m[0].replace(/\s/g, '').replace(/[.,]$/, '');
  const comma = n.lastIndexOf(',');
  const dot = n.lastIndexOf('.');
  if (comma > dot) n = n.replace(/\./g, '').replace(',', '.');
  else n = n.replace(/,/g, '');
  const price = parseFloat(n);
  return { price: Number.isFinite(price) && price > 0 ? Math.round(price * 100) / 100 : null, currency };
}

export function extractProduct(doc: Document, pageUrl: string, live = false): ExtractedProduct {
  const host = (() => {
    try {
      return new URL(pageUrl).hostname.toLowerCase();
    } catch {
      return '';
    }
  })();
  const site = /aliexpress/.test(host)
    ? 'AliExpress'
    : /alibaba/.test(host)
      ? 'Alibaba'
      : /temu/.test(host)
        ? 'Temu'
        : /ebay/.test(host)
          ? 'eBay'
          : /amazon/.test(host)
            ? 'Amazon'
            : host.replace(/^www\./, '');

  const clean = (s: unknown) =>
    String(s ?? '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/[ \t ]+/g, ' ')
      .replace(/\s*\n\s*/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  const text = (sel: string) => clean(doc.querySelector(sel)?.textContent);
  const meta = (name: string) =>
    doc.querySelector(`meta[property="${name}"],meta[name="${name}"],meta[itemprop="${name}"]`)?.getAttribute('content')?.trim() || '';
  const abs = (u: unknown) => {
    const s = String(u ?? '').trim();
    if (!s || s.startsWith('data:') || s.startsWith('blob:')) return '';
    try {
      return new URL(s, pageUrl).href;
    } catch {
      return '';
    }
  };

  // ---- 1. Struktūriniai duomenys (schema.org Product)
  const ld: Record<string, any>[] = [];
  const visit = (n: any): void => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(visit);
    const types = ([] as unknown[]).concat(n['@type'] ?? []).map(String);
    if (types.some((t) => /product/i.test(t))) ld.push(n);
    if (n['@graph']) visit(n['@graph']);
  };
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
    try {
      visit(JSON.parse(s.textContent || ''));
    } catch {
      /* netinkamas JSON */
    }
  });
  const p = ld[0] ?? {};
  const ldImages = ([] as any[])
    .concat(p.image ?? [])
    .map((i) => (typeof i === 'string' ? i : i?.url || i?.contentUrl))
    .filter(Boolean);
  const offers = ([] as any[]).concat(p.offers ?? [])[0] ?? {};
  const ldPrice = offers.price ?? offers.lowPrice ?? offers.priceSpecification?.price;
  const ldCurrency = offers.priceCurrency ?? offers.priceSpecification?.priceCurrency;
  const ldSpecs = ([] as any[])
    .concat(p.additionalProperty ?? [])
    .map((x) => ({ label: clean(x?.name), value: clean(x?.value) }))
    .filter((x) => x.label && x.value);

  let title = clean(p.name) || meta('og:title') || meta('twitter:title') || clean(doc.title);
  let description = clean(p.description) || meta('og:description') || meta('description');
  let images: string[] = [...ldImages];
  let priceText: string = ldPrice !== undefined ? String(ldPrice) : meta('product:price:amount') || meta('og:price:amount') || meta('price');
  let currency: string | null = ldCurrency || meta('product:price:currency') || meta('og:price:currency') || meta('priceCurrency') || null;
  let specs = ldSpecs;
  const brand = clean(typeof p.brand === 'string' ? p.brand : p.brand?.name);
  const sku = clean(p.sku || p.mpn);
  const og = Array.from(doc.querySelectorAll('meta[property="og:image"],meta[name="og:image"]')).map((m) => m.getAttribute('content'));

  const imgs = (sel: string, attrs = ['data-zoom-src', 'data-old-hires', 'data-src', 'src']) =>
    Array.from(doc.querySelectorAll(sel))
      .map((el) => attrs.map((a) => el.getAttribute(a)).find((v) => v && !v.startsWith('data:')))
      .filter(Boolean) as string[];
  const pairs = (rows: string, labelSel: string, valueSel: string) =>
    Array.from(doc.querySelectorAll(rows))
      .map((r) => ({ label: clean(r.querySelector(labelSel)?.textContent).replace(/:$/, ''), value: clean(r.querySelector(valueSel)?.textContent) }))
      .filter((x) => x.label && x.value);

  // ---- 2. Konkrečios parduotuvės
  if (site === 'Amazon') {
    title = text('#productTitle') || title;
    priceText = text('#corePrice_feature_div .a-offscreen') || text('.a-price .a-offscreen') || text('#priceblock_ourprice') || priceText;
    const dyn = doc.querySelector('#landingImage')?.getAttribute('data-a-dynamic-image');
    try {
      if (dyn) images.push(...Object.keys(JSON.parse(dyn)));
    } catch {
      /* nėra */
    }
    images.push(...imgs('#altImages img, #imageBlock img'));
    const bullets = Array.from(doc.querySelectorAll('#feature-bullets li'))
      .map((li) => clean(li.textContent))
      .filter(Boolean);
    const desc = text('#productDescription');
    if (bullets.length || desc) description = [bullets.map((b) => `• ${b}`).join('\n'), desc].filter(Boolean).join('\n\n');
    specs = specs.length ? specs : [...pairs('#productDetails_techSpec_section_1 tr, #productDetails_detailBullets_sections1 tr', 'th', 'td'), ...pairs('#productOverview_feature_div tr', 'td:first-child', 'td:last-child')];
  } else if (site === 'AliExpress') {
    title = text('h1[data-pl="product-title"]') || text('h1') || title;
    priceText =
      text('[class*="price-default--current"]') || text('[class*="price--current"]') || text('.product-price-current') || text('[class*="product-price-value"]') || priceText;
    images.push(...imgs('[class*="slider--"] img, [class*="image-view"] img, [class*="images-view"] img, .magnifier-image'));
    specs = specs.length ? specs : pairs('[class*="specification--prop"], [class*="specification--line"] > div', '[class*="specification--title"]', '[class*="specification--desc"]');
    const desc = text('#product-description');
    if (desc && desc.length > 40) description = desc;
    if (/smarter shopping|aliexpress\.com/i.test(description)) description = '';
  } else if (site === 'eBay') {
    title = text('h1.x-item-title__mainTitle') || text('h1') || title;
    priceText = text('.x-price-primary') || priceText;
    images.push(...imgs('.ux-image-carousel-item img, .ux-image-grid img'));
    specs = specs.length ? specs : pairs('.ux-layout-section-evo__col', '.ux-labels-values__labels', '.ux-labels-values__values');
  } else if (site === 'Alibaba') {
    title = text('h1') || title;
    priceText = priceText || text('[class*="price"]');
    images.push(...imgs('[class*="main-image"] img, [class*="slider"] img, [class*="thumb"] img'));
    specs = specs.length ? specs : pairs('[class*="attribute"] [class*="item"], .do-entry-item', '[class*="name"], .attr-name', '[class*="value"], .attr-value');
  } else if (site === 'Temu') {
    images.push(...imgs('img[src*="kwcdn.com"]'));
  }

  images.push(...(og as string[]));

  // ---- 3. Jei vis dar mažai nuotraukų – didžiausios puslapio nuotraukos (tik atidarytame puslapyje)
  if (live && images.length < 2) {
    Array.from(doc.images)
      .filter((im) => im.naturalWidth >= 400 && im.naturalHeight >= 300)
      .sort((a, b) => b.naturalWidth * b.naturalHeight - a.naturalWidth * a.naturalHeight)
      .slice(0, 8)
      .forEach((im) => images.push(im.currentSrc || im.src));
  }

  // ---- 4. Didžiausios nuotraukų versijos, be dublikatų
  const big = (u: string) =>
    u
      .replace(/(\.(?:jpe?g|png|webp))_[^/]*$/i, '$1') // AliExpress: ...jpg_640x640.jpg_.avif → ...jpg
      .replace(/\._[A-Z0-9_,]+_\./i, '.') // Amazon: ..._AC_SX679_.jpg → .jpg
      .replace(/\/s-l\d+\./, '/s-l1600.') // eBay
      .replace(/(kwcdn\.com\/[^?]+)\?.*$/, '$1'); // Temu
  const seen = new Set<string>();
  images = images
    .map((u) => abs(big(String(u))))
    .filter((u) => {
      if (!u || !/^https?:/.test(u) || /sprite|icon|logo|placeholder|\.svg|\.gif/i.test(u)) return false;
      const key = u.replace(/^https?:/, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);

  title = title
    .replace(/^Amazon\.[a-z.]+\s*:\s*/i, '')
    .replace(/\s*[-|–:]\s*(AliExpress|Amazon\.[a-z.]+|eBay|Temu|Alibaba(\.com)?)\b.*$/i, '')
    .replace(/\s*\|\s*eBay$/i, '')
    .trim();
  if (description && description.toLowerCase() === title.toLowerCase()) description = '';

  const parsed = parsePrice(priceText);
  return {
    url: pageUrl,
    site,
    title: title.slice(0, 200),
    description: description.slice(0, 5000),
    images,
    price: parsed.price,
    currency: (currency && String(currency).toUpperCase().slice(0, 3)) || parsed.currency,
    specs: specs.slice(0, 15).map((s) => ({ label: s.label.slice(0, 60), value: s.value.slice(0, 120) })),
    brand: brand.slice(0, 60),
    sku: sku.slice(0, 60),
  };
}
