/*
 * Šviesi / tamsi tema.
 * „Auto“ režimas: šviesi nuo saulėtekio iki saulėlydžio (skaičiuojama Lietuvai), vakare – tamsi.
 * Vartotojo pasirinkimas saugomas naršyklėje (localStorage „tema“).
 * Įkeliamas <head> pradžioje, kad puslapis iš karto būtų reikiamos spalvos (be mirgėjimo).
 */
(function () {
  var LAT = 55.5;
  var LNG = 24.3;
  var KEY = 'tema';
  var root = document.documentElement;
  var timer;

  // NOAA saulėtekio / saulėlydžio algoritmas (± 1–2 min.)
  function sunTime(date, rising) {
    var rad = Math.PI / 180;
    var start = Date.UTC(date.getFullYear(), 0, 0);
    var day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 864e5);
    var lngHour = LNG / 15;
    var t = day + ((rising ? 6 : 18) - lngHour) / 24;
    var M = 0.9856 * t - 3.289;
    var L = (M + 1.916 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 282.634 + 360) % 360;
    var RA = (Math.atan(0.91764 * Math.tan(L * rad)) / rad + 360) % 360;
    RA = (RA + (Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90)) / 15;
    var sinDec = 0.39782 * Math.sin(L * rad);
    var cosDec = Math.cos(Math.asin(sinDec));
    var cosH = (Math.cos(90.833 * rad) - sinDec * Math.sin(LAT * rad)) / (cosDec * Math.cos(LAT * rad));
    if (cosH > 1 || cosH < -1) return null;
    var H = (rising ? 360 - Math.acos(cosH) / rad : Math.acos(cosH) / rad) / 15;
    var UT = (H + RA - 0.06571 * t - 6.622 - lngHour + 48) % 24;
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) + UT * 3600e3);
  }

  function times(now) {
    var rise = sunTime(now, true);
    var set = sunTime(now, false);
    if (!rise || !set) {
      rise = new Date(now); rise.setHours(7, 0, 0, 0);
      set = new Date(now); set.setHours(19, 0, 0, 0);
    }
    return { rise: rise, set: set };
  }

  function getPref() {
    try {
      var v = localStorage.getItem(KEY);
      return v === 'light' || v === 'dark' ? v : 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function apply() {
    var pref = getPref();
    var now = new Date();
    var t = times(now);
    var theme = pref === 'auto' ? (now >= t.rise && now < t.set ? 'light' : 'dark') : pref;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-theme-pref', pref);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#06111a' : '#f3f8fc');

    // Automatinis persijungimas saulėtekio / saulėlydžio metu
    clearTimeout(timer);
    if (pref === 'auto') {
      var next = now < t.rise ? t.rise : now < t.set ? t.set : times(new Date(now.getTime() + 864e5)).rise;
      timer = setTimeout(apply, Math.min(next - now + 1000, 6 * 3600e3));
    }
    window.dispatchEvent(new CustomEvent('tema', { detail: { theme: theme, pref: pref, rise: t.rise, set: t.set } }));
    return theme;
  }

  window.stTema = {
    set: function (pref) {
      try {
        if (pref === 'auto') localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, pref);
      } catch (e) {}
      return apply();
    },
    pref: getPref,
    times: function () {
      return times(new Date());
    },
  };

  root.classList.remove('no-js');
  apply();
})();
