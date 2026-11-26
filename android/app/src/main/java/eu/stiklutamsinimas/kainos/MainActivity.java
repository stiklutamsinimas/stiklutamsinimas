package eu.stiklutamsinimas.kainos;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import android.window.OnBackInvokedDispatcher;

/**
 * Programėlė rodo gyvą skaičiuoklę iš https://stiklutamsinimas.eu/skaiciuokle/.
 * Kainos ir išvaizda atsinaujina automatiškai, kai atnaujinama svetainė –
 * naujos programėlės versijos tam nereikia.
 */
public class MainActivity extends Activity {

    private static final String OFFLINE_URL = "file:///android_asset/offline.html";
    private static final long RELOAD_AFTER_MS = 10 * 60 * 1000L; // perkrauti, jei programėlė ilgai buvo fone

    private WebView web;
    private FrameLayout root;
    private long pausedAt = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#06111a"));
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#06111a"));
        root.addView(web, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        // Turinys nuo krašto iki krašto: atitraukiame nuo būsenos juostos, navigacijos ir klaviatūros
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((v, insets) -> {
                android.graphics.Insets bars = insets.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                android.graphics.Insets ime = insets.getInsets(WindowInsets.Type.ime());
                v.setPadding(bars.left, bars.top, bars.right, Math.max(bars.bottom, ime.bottom));
                return WindowInsets.CONSUMED;
            });
        }
        setDarkBars(true);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportMultipleWindows(false);
        s.setMediaPlaybackRequiresUserGesture(true);
        // Pagal šį žymenį svetainė žino, kad atidaryta programėlėje (paslepia „Įdiegti“, rodo atnaujinimus)
        s.setUserAgentString(s.getUserAgentString() + " StiklutamsinimasApp/" + BuildConfig.VERSION_CODE);

        web.addJavascriptInterface(new Bridge(), "StiklApp");
        web.setWebViewClient(new Client());
        // Failų atsisiuntimai (pvz. nauja programėlės versija) – per naršyklę
        web.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) ->
                openExternal(Uri.parse(url)));

        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::goBackOrFinish);
        }

        if (savedInstanceState != null) {
            web.restoreState(savedInstanceState);
        } else {
            web.loadUrl(startUrl(getIntent()));
        }
    }

    private String startUrl(Intent intent) {
        Uri data = intent != null ? intent.getData() : null;
        if (data != null && isOwnSite(data)) return data.toString();
        return BuildConfig.APP_URL;
    }

    private static boolean isOwnSite(Uri u) {
        String scheme = u.getScheme(), host = u.getHost();
        return host != null && "https".equals(scheme)
                && (host.equals(BuildConfig.APP_HOST) || host.endsWith("." + BuildConfig.APP_HOST));
    }

    /** Atidaro nuorodą kitoje programėlėje: telefonas, WhatsApp, Viber, el. paštas, naršyklė. */
    private boolean openExternal(Uri u) {
        try {
            Intent i;
            if ("intent".equals(u.getScheme())) {
                i = Intent.parseUri(u.toString(), Intent.URI_INTENT_SCHEME);
                i.addCategory(Intent.CATEGORY_BROWSABLE);
                i.setComponent(null);
                i.setSelector(null);
            } else {
                i = new Intent(Intent.ACTION_VIEW, u);
            }
            startActivity(i);
        } catch (Exception e) {
            String msg = "viber".equals(u.getScheme())
                    ? "Viber programėlė neįdiegta"
                    : "Nepavyko atidaryti nuorodos";
            Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
        }
        return true;
    }

    private void goBackOrFinish() {
        if (web.canGoBack()) web.goBack();
        else finish();
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Uri data = intent.getData();
        if (data != null && isOwnSite(data)) web.loadUrl(data.toString());
    }

    @Override
    protected void onPause() {
        super.onPause();
        pausedAt = SystemClock.elapsedRealtime();
        web.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        if (pausedAt > 0 && SystemClock.elapsedRealtime() - pausedAt > RELOAD_AFTER_MS) {
            String url = web.getUrl();
            if (url == null || url.startsWith("file:")) web.loadUrl(BuildConfig.APP_URL);
            else web.reload();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            web.removeJavascriptInterface("StiklApp");
            web.destroy();
        }
        super.onDestroy();
    }

    /** Būsenos ir navigacijos juostų spalva pagal svetainės temą. */
    @SuppressWarnings("deprecation")
    private void setDarkBars(boolean dark) {
        int bg = Color.parseColor(dark ? "#06111a" : "#f3f8fc");
        root.setBackgroundColor(bg);
        if (Build.VERSION.SDK_INT < 35) {
            getWindow().setStatusBarColor(bg);
            getWindow().setNavigationBarColor(bg);
        }
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController c = getWindow().getInsetsController();
            if (c != null) {
                int light = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                        | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
                c.setSystemBarsAppearance(dark ? 0 : light, light);
            }
        } else if (Build.VERSION.SDK_INT >= 26) {
            View d = getWindow().getDecorView();
            int f = d.getSystemUiVisibility();
            int light = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            d.setSystemUiVisibility(dark ? (f & ~light) : (f | light));
        }
    }

    /** Svetainė praneša apie temos pakeitimą: window.StiklApp.tema('dark' | 'light'). */
    public class Bridge {
        @JavascriptInterface
        public void tema(String t) {
            runOnUiThread(() -> setDarkBars(!"light".equals(t)));
        }
    }

    private class Client extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri u = request.getUrl();
            String path = u.getPath();
            if (path != null && path.endsWith(".apk")) return openExternal(u); // atnaujinimas – naršyklėje
            if (isOwnSite(u)) return false;            // savo svetainė – programėlėje
            if ("file".equals(u.getScheme())) return false;
            return openExternal(u);                     // visa kita – telefono programėlėse
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            if (request.isForMainFrame()) view.loadUrl(OFFLINE_URL);
        }
    }
}
