/* Kainų skaičiuoklė (/skaiciuokle): pastatų stiklų plėvelės ir ploteriuoti lipdukai.
 * Kainos – src/data/kainos.json (įdedamos į puslapį kūrimo metu). Pakeitus jas per /admin,
 * Cloudflare perkuria svetainę ir naujos kainos atsiranda ir puslapyje, ir Android programėlėje. */

const root = document.getElementById('skaiciuokle');
const dataEl = document.getElementById('sk-kainos');

if (root && dataEl) {
  const K = JSON.parse(dataEl.textContent || '{}');
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const nf = new Intl.NumberFormat('lt-LT', { maximumFractionDigits: 0 });
  const nf2 = new Intl.NumberFormat('lt-LT', { maximumFractionDigits: 2 });
  const eur = (v) => nf.format(v) + ' €';
  const m2 = (v) => nf2.format(v) + ' m²';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const sk = (v) => {
    const n = parseFloat(String(v ?? '').replace(',', '.').replace(/\s/g, ''));
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const TICK = '<span class="sk-tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>';
  const PLUS = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M12 5v14"/></svg>';
  const TRASH = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
  const perM2 = (v) => (v == null ? '' : eur(v) + '<small style="margin:0 0 0 .15rem">/m²</small>');

  const appM = navigator.userAgent.match(/StiklutamsinimasApp\/(\d+)/);
  const IN_APP = !!appM;
  const APP_VER = appM ? +appM[1] : 0;

  const S = {
    tab: 'pastatai',
    pastatai: { tipas: 0, sena: false },
    lipdukai: { tipas: 0, klijavimas: true, maketas: false, senu: false },
  };
  const PLOTAI = {};

  /* ---------- Kaina su (nebūtinu) metiniu didinimu ---------- */
  const kaina = (v) => {
    if (v === null || v === undefined || v === '') return null;
    v = +v;
    if (!Number.isFinite(v)) return null;
    const ix = K.indeksavimas || {};
    if (!ix.ijungta) return v;
    const metai = new Date().getFullYear() - (+ix.bazes_metai || new Date().getFullYear());
    if (metai <= 0) return v;
    const st = +ix.apvalinti_iki || 1;
    return Math.round((v * Math.pow(1 + (+ix.metinis_proc || 0) / 100, metai)) / st) * st;
  };
  const kainuMetai = () => {
    const ix = K.indeksavimas || {};
    return ix.ijungta ? Math.max(new Date().getFullYear(), +ix.bazes_metai || 0) : K.kainu_metai || new Date().getFullYear();
  };

  /* ---------- Skirtukai ---------- */
  const TABS = ['pastatai', 'lipdukai'];
  const setTab = (t, fokusas) => {
    if (!TABS.includes(t)) t = 'pastatai';
    S.tab = t;
    $$('[data-sk-tab]').forEach((b) => {
      const on = b.dataset.skTab === t;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && fokusas) b.focus();
    });
    TABS.forEach((x) => ($('#sk-p-' + x).hidden = x !== t));
    const h = t === 'pastatai' ? '' : '#' + t;
    if (location.hash !== h) history.replaceState(null, '', location.pathname + location.search + h);
    render();
  };
  $$('[data-sk-tab]').forEach((b, i, all) => {
    b.addEventListener('click', () => setTab(b.dataset.skTab));
    b.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      setTab(all[(i + d + all.length) % all.length].dataset.skTab, true);
    });
  });

  const setKaina = (k, html) => {
    const el = $('[data-sk-kaina="' + k + '"]');
    if (el) el.innerHTML = html;
  };

  /* ---------- Plotas (pastatai, lipdukai) ---------- */
  const plotas = (key) => {
    const st = PLOTAI[key];
    if (!st) return 0;
    if (st.rez === 'm2') return Math.round(sk(st.m2) * 100) / 100;
    const a = st.eil.reduce((s, e) => s + (sk(e.w) * sk(e.h) * sk(e.n)) / 10000, 0);
    return Math.round(a * 100) / 100;
  };
  const kiekis = (key) => {
    const st = PLOTAI[key];
    if (!st || st.rez === 'm2') return 0;
    return st.eil.reduce((s, e) => s + (sk(e.w) && sk(e.h) ? Math.round(sk(e.n)) : 0), 0);
  };

  const initPlotas = (box) => {
    const key = box.dataset.skPlotas;
    const vnt = box.dataset.vnt || 'langą';
    const st = (PLOTAI[key] = { rez: 'dim', m2: '', eil: [{ w: '', h: '', n: '1' }] });
    box.innerHTML =
      '<div class="sk-row" role="group" aria-label="Kaip įvesti plotą">' +
      '<button type="button" class="chip" data-rez="dim" aria-pressed="true">Pagal matmenis</button>' +
      '<button type="button" class="chip" data-rez="m2" aria-pressed="false">Žinau plotą (m²)</button></div>' +
      '<div data-dimbox><div class="sk-dims" data-dims></div>' +
      '<button type="button" class="btn btn-outline mt-3 !px-4 !py-2 text-sm" data-add>' + PLUS + 'Pridėti dar vieną ' + vnt + '</button></div>' +
      '<div class="sk-field" data-m2box hidden><label class="sk-label" for="sk-m2-' + key + '">Bendras plotas, m²</label>' +
      '<input class="sk-input" id="sk-m2-' + key + '" type="text" inputmode="decimal" placeholder="Pvz. 6,5" autocomplete="off"></div>' +
      '<div class="sk-area"><span>Bendras plotas</span><b data-area>0 m²</b></div>';
    const dims = $('[data-dims]', box);
    const piesti = () => {
      dims.innerHTML = st.eil
        .map((e, i) => {
          const id = key + '-' + i;
          const f = (n, lbl, val, ph, mode) =>
            '<div class="sk-field"><label class="sk-label" for="sk-' + n + '-' + id + '">' + lbl + '</label>' +
            '<input class="sk-input" id="sk-' + n + '-' + id + '" data-f="' + n + '" type="text" inputmode="' + mode + '" value="' + esc(val) + '" placeholder="' + ph + '"></div>';
          return (
            '<div class="sk-dim" data-i="' + i + '">' +
            f('w', i + 1 + '. Plotis, cm', e.w, '120', 'decimal') +
            f('h', 'Aukštis, cm', e.h, '140', 'decimal') +
            f('n', 'Kiekis', e.n, '1', 'numeric') +
            '<button type="button" class="sk-icon-btn" data-del aria-label="Pašalinti ' + (i + 1) + ' eilutę"' + (st.eil.length < 2 ? ' style="visibility:hidden"' : '') + '>' + TRASH + '</button></div>'
          );
        })
        .join('');
    };
    const atnaujinti = () => {
      $('[data-area]', box).textContent = m2(plotas(key));
      render();
    };
    dims.addEventListener('input', (e) => {
      const row = e.target.closest('.sk-dim');
      if (!row) return;
      st.eil[+row.dataset.i][e.target.dataset.f] = e.target.value;
      atnaujinti();
    });
    dims.addEventListener('click', (e) => {
      const b = e.target.closest('[data-del]');
      if (!b) return;
      st.eil.splice(+b.closest('.sk-dim').dataset.i, 1);
      piesti();
      atnaujinti();
    });
    $('[data-add]', box).addEventListener('click', () => {
      st.eil.push({ w: '', h: '', n: '1' });
      piesti();
      const f = $('.sk-dim:last-child input', dims);
      if (f) f.focus();
    });
    $('#sk-m2-' + key).addEventListener('input', (e) => {
      st.m2 = e.target.value;
      atnaujinti();
    });
    $$('[data-rez]', box).forEach((b) =>
      b.addEventListener('click', () => {
        st.rez = b.dataset.rez;
        $$('[data-rez]', box).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        $('[data-dimbox]', box).hidden = st.rez !== 'dim';
        $('[data-m2box]', box).hidden = st.rez !== 'm2';
        atnaujinti();
      }),
    );
    piesti();
  };

  const radioKorteles = (sel, vardas, sarasas, aktyvus) => {
    $(sel).innerHTML = sarasas
      .map(
        (p, i) =>
          '<label class="sk-choice"><input type="radio" name="' + vardas + '" value="' + i + '"' + (i === aktyvus ? ' checked' : '') + '>' + TICK +
          '<span><span class="sk-ctitle">' + esc(p.pavadinimas) + '</span>' + (p.aprasymas ? '<span class="sk-csub">' + esc(p.aprasymas) + '</span>' : '') + '</span>' +
          '<span class="sk-cprice">' + perM2(kaina(p.kaina_m2)) + '</span></label>',
      )
      .join('');
  };

  /* ---------- PASTATAI ---------- */
  radioKorteles('#sk-pastatu-pleveles', 'sk-pplev', K.pastatai.pleveles, 0);
  $('#sk-pastatu-pleveles').addEventListener('change', (e) => {
    S.pastatai.tipas = +e.target.value;
    render();
  });
  $('#sk-p-sena').addEventListener('change', (e) => {
    S.pastatai.sena = e.target.checked;
    render();
  });

  const skaiciuotiPastatus = () => {
    const p = K.pastatai.pleveles[S.pastatai.tipas] || K.pastatai.pleveles[0];
    const A = plotas('pastatai');
    const n = kiekis('pastatai');
    const nuem = kaina(K.pastatai.senos_nuemimas_m2);
    setKaina('p-sena', nuem == null ? '–' : '<small>+</small>' + perM2(nuem));
    const ka = A ? m2(A) + (n ? ' · ' + n + ' ' + (n === 1 ? 'langas' : n < 10 ? 'langai' : 'langų') : '') : 'Įveskite stiklų matmenis arba plotą';
    if (!A) return { pav: p.pavadinimas, ka, eil: [], suma: null, msg: 'Sveiki! Domina pastato langų plėvelė (' + p.pavadinimas + '). Kokia būtų kaina?' };
    const kn = kaina(p.kaina_m2);
    const min = kaina(p.min_kaina);
    const baz = kn == null ? null : Math.round(A * kn);
    const eil = [];
    if (baz != null && min != null && baz < min) eil.push([p.pavadinimas + ' – minimali užsakymo kaina', min]);
    else eil.push([p.pavadinimas + ', ' + m2(A) + ' × ' + eur(kn), baz]);
    if (S.pastatai.sena) eil.push(['Senos plėvelės nuėmimas, ' + m2(A), nuem == null ? null : Math.round(A * nuem)]);
    const r = sumuoti(eil, false);
    r.pav = p.pavadinimas;
    r.ka = ka;
    r.msg =
      'Sveiki! Domina pastato langų plėvelė.\nPlėvelė: ' + p.pavadinimas + '\nPlotas: ' + m2(A) + (n ? ' (' + n + ' vnt.)' : '') +
      (S.pastatai.sena ? '\nPapildomai: senos plėvelės nuėmimas' : '') + (r.suma != null ? '\nSkaičiuoklės kaina: ' + eur(r.suma) : '');
    return r;
  };

  /* ---------- LIPDUKAI ---------- */
  const L = K.lipdukai;
  radioKorteles('#sk-lipduku-tipai', 'sk-ltip', L.tipai, 0);
  $('#sk-lipduku-tipai').addEventListener('change', (e) => {
    S.lipdukai.tipas = +e.target.value;
    render();
  });
  ['klijavimas', 'maketas', 'senu'].forEach((k) =>
    $('#sk-l-' + k).addEventListener('change', (e) => {
      S.lipdukai[k] = e.target.checked;
      render();
    }),
  );

  const skaiciuotiLipdukus = () => {
    const t = L.tipai[S.lipdukai.tipas] || L.tipai[0];
    const st = S.lipdukai;
    const A = plotas('lipdukai');
    const kl = kaina(L.klijavimas_m2);
    const mk = kaina(L.maketas);
    const sn = kaina(L.senu_nuemimas_m2);
    setKaina('l-klijavimas', kl == null ? '–' : '<small>+</small>' + perM2(kl));
    setKaina('l-maketas', mk == null ? '–' : '<small>+</small>' + eur(mk));
    setKaina('l-senu', sn == null ? '–' : '<small>+</small>' + perM2(sn));
    const pav = 'Lipdukai: ' + t.pavadinimas;
    if (!A) return { pav, ka: 'Įveskite lipdukų matmenis arba plotą', eil: [], suma: null, msg: 'Sveiki! Domina ploteriuoti lipdukai (' + t.pavadinimas + '). Kokia būtų kaina?' };
    const kn = kaina(t.kaina_m2);
    const gam = kn == null ? null : Math.round(A * kn);
    const mon = st.klijavimas && kl != null ? Math.round(A * kl) : 0;
    const min = kaina(st.klijavimas ? L.min_su_klijavimu : L.min_be_klijavimo);
    const eil = [];
    if (gam != null && min != null && gam + mon < min) {
      eil.push([(st.klijavimas ? 'Gamyba ir klijavimas' : 'Gamyba') + ' – minimalus užsakymas', min]);
    } else {
      eil.push(['Gamyba, ' + m2(A) + ' × ' + eur(kn), gam]);
      if (st.klijavimas) eil.push(['Klijavimas, ' + m2(A), kl == null ? null : mon]);
    }
    if (st.maketas) eil.push(['Maketo paruošimas', mk]);
    if (st.senu) eil.push(['Senų lipdukų nuėmimas, ' + m2(A), sn == null ? null : Math.round(A * sn)]);
    const r = sumuoti(eil, false);
    r.pav = pav;
    r.ka = m2(A);
    const pap = [st.klijavimas ? 'su klijavimu' : 'be klijavimo', st.maketas ? 'reikia maketo' : '', st.senu ? 'nuimti senus lipdukus' : ''].filter(Boolean).join(', ');
    r.msg = 'Sveiki! Domina ploteriuoti lipdukai.\nPlėvelė: ' + t.pavadinimas + '\nPlotas: ' + m2(A) + '\nPapildomai: ' + pap + (r.suma != null ? '\nSkaičiuoklės kaina: ' + eur(r.suma) : '');
    return r;
  };

  /* ---------- Suvestinė ---------- */
  function sumuoti(eil, nuo) {
    let suma = 0;
    let yra = false;
    eil.forEach((e) => {
      if (e[1] == null) nuo = true;
      else {
        suma += e[1];
        yra = true;
      }
    });
    return { eil, suma: yra ? suma : null, nuo };
  }

  function render() {
    const r = S.tab === 'lipdukai' ? skaiciuotiLipdukus() : skaiciuotiPastatus();
    $('#sk-suv-h').textContent = r.pav;
    $('#sk-suv-ka').textContent = r.ka || '';
    $('#sk-suv-eilutes').innerHTML = r.eil
      .map((e) => '<li class="' + (e[1] == null ? 'sk-muted' : '') + '"><span>' + esc(e[0]) + '</span><b>' + (e[2] || (e[1] == null ? 'derinama' : eur(e[1]))) + '</b></li>')
      .join('');
    const sumaHtml = r.suma == null ? '–' : (r.nuo ? '<small>nuo</small>' : '') + eur(r.suma);
    $('#sk-suv-suma').innerHTML = sumaHtml;
    $('#sk-mbar-suma').innerHTML = sumaHtml;
    document.body.classList.toggle('sk-mbar-on', r.suma != null && !suvestineMatoma);
    $('#sk-suv-pastaba').textContent = [K.pastaba, K.pvm_pastaba, 'Kainos ' + kainuMetai() + ' m.'].filter(Boolean).join(' ');
    const msg = encodeURIComponent(r.msg || '');
    $('#sk-cta-wa').href = 'https://wa.me/' + (root.dataset.wa || '') + '?text=' + msg;
    $('#sk-cta-viber').href = 'viber://chat?number=' + encodeURIComponent(root.dataset.viber || '') + '&draft=' + msg;
  }

  /* ---------- Apatinė juosta telefone: slepiama, kai suvestinė matoma ---------- */
  let suvestineMatoma = false;
  if ('IntersectionObserver' in window) {
    const stebetojas = new IntersectionObserver(
      (en) => {
        suvestineMatoma = en[0].isIntersecting;
        render();
      },
      { threshold: 0.15 },
    );
    stebetojas.observe($('#sk-suvestine'));
  }

  /* ---------- Android programėlė ---------- */
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) $('#sk-programele').hidden = true;
  if (IN_APP) {
    $('#sk-programele').hidden = true;
    fetch('/programele/versija.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => {
        if (v && +v.versionCode > APP_VER) $('#sk-atnaujinimas').hidden = false;
      })
      .catch(() => {});
    // Būsenos juostos spalva pagal svetainės temą
    const tema = (t) => {
      try {
        if (window.StiklApp && window.StiklApp.tema) window.StiklApp.tema(t);
      } catch {
        /* ne programėlėje */
      }
    };
    tema(document.documentElement.getAttribute('data-theme') || 'light');
    window.addEventListener('tema', (e) => tema(e.detail && e.detail.theme));
  }

  /* ---------- Paleidimas ---------- */
  $$('[data-sk-plotas]').forEach(initPlotas);
  setTab((location.hash || '').slice(1) || 'pastatai');
}
