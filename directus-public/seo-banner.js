(function() {
    var CHECK_INTERVAL = 1000;
    var BANNER_ID = 'seo-dashboard-banner';

    function inject() {
        // Only on SEO collection page
        if (!location.pathname.includes('/content/seo')) return;
        if (document.getElementById(BANNER_ID)) return;

        // Find the main content area
        var header = document.querySelector('.header-bar');
        if (!header) return;

        var banner = document.createElement('a');
        banner.id = BANNER_ID;
        banner.href = 'http://localhost:3000/seo-dashboard';
        banner.target = '_blank';
        banner.rel = 'noopener';
        banner.innerHTML = '<span style="margin-right:8px;">📊</span> Abrir SEO Dashboard avanzado <span style="margin-left:8px;opacity:0.7;">→</span>';
        banner.style.cssText = 'display:flex;align-items:center;justify-content:center;margin:12px 32px 0;padding:14px 24px;background:#111;color:#fff;font-family:Inter,sans-serif;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;transition:background 0.2s;letter-spacing:0.3px;';
        banner.onmouseenter = function() { this.style.background = '#333'; };
        banner.onmouseleave = function() { this.style.background = '#111'; };

        header.parentNode.insertBefore(banner, header.nextSibling);
    }

    // SPA: re-check on navigation
    setInterval(inject, CHECK_INTERVAL);
    inject();
})();
