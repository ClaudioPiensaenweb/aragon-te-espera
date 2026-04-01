/* =============================================
   Cookie Consent - RGPD España
   Uses js-cookie: https://github.com/js-cookie/js-cookie
   ============================================= */

(function () {
    var COOKIE_NAME = 'ate_cookie_consent';
    var COOKIE_DAYS = 365;
    var isEN = window.location.pathname.startsWith('/en');

    var txt = {
        es: {
            title: 'Utilizamos cookies',
            desc: 'Usamos cookies propias y de terceros para analizar el tráfico y mejorar nuestros servicios. Puedes aceptar todas, rechazarlas o configurarlas.',
            accept: 'Aceptar todas',
            reject: 'Rechazar',
            config: 'Configurar',
            save: 'Guardar preferencias',
            necessary: 'Necesarias',
            necessaryDesc: 'Imprescindibles para el funcionamiento del sitio web. No se pueden desactivar.',
            analytics: 'Analíticas',
            analyticsDesc: 'Nos permiten medir el tráfico y analizar el comportamiento de los usuarios para mejorar el servicio.',
            marketing: 'Marketing',
            marketingDesc: 'Utilizadas para mostrar publicidad relevante y medir la eficacia de las campañas.',
            moreInfo: 'Más información en nuestra',
            cookiePolicy: 'política de cookies',
            cookieLink: '/politica-de-cookies',
            always: 'Siempre activas'
        },
        en: {
            title: 'We use cookies',
            desc: 'We use our own and third-party cookies to analyse traffic and improve our services. You can accept all, reject or configure them.',
            accept: 'Accept all',
            reject: 'Reject',
            config: 'Configure',
            save: 'Save preferences',
            necessary: 'Necessary',
            necessaryDesc: 'Essential for the website to function. They cannot be deactivated.',
            analytics: 'Analytics',
            analyticsDesc: 'Allow us to measure traffic and analyse user behaviour to improve the service.',
            marketing: 'Marketing',
            marketingDesc: 'Used to display relevant advertising and measure campaign effectiveness.',
            moreInfo: 'More information in our',
            cookiePolicy: 'cookie policy',
            cookieLink: '/en/cookie-policy',
            always: 'Always active'
        }
    };

    var t = isEN ? txt.en : txt.es;

    function getConsent() {
        var val = Cookies.get(COOKIE_NAME);
        return val ? JSON.parse(val) : null;
    }

    function setConsent(consent) {
        Cookies.set(COOKIE_NAME, JSON.stringify(consent), { expires: COOKIE_DAYS, sameSite: 'Lax' });
        applyConsent(consent);
        hideBanner();
        hideConfig();
    }

    function applyConsent(consent) {
        if (consent.analytics) {
            // Enable analytics cookies (placeholder for GA, etc.)
            document.dispatchEvent(new CustomEvent('cookies:analytics', { detail: true }));
        }
        if (consent.marketing) {
            // Enable marketing cookies (placeholder)
            document.dispatchEvent(new CustomEvent('cookies:marketing', { detail: true }));
        }
    }

    function createBanner() {
        var banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML =
            '<div class="cookie-banner-inner">' +
                '<div class="cookie-banner-text">' +
                    '<strong>' + t.title + '</strong>' +
                    '<p>' + t.desc + '<br><a href="' + t.cookieLink + '">' + t.moreInfo + ' ' + t.cookiePolicy + '</a>.</p>' +
                '</div>' +
                '<div class="cookie-banner-actions">' +
                    '<button id="cookie-reject" class="cookie-btn cookie-btn-secondary">' + t.reject + '</button>' +
                    '<button id="cookie-config" class="cookie-btn cookie-btn-secondary">' + t.config + '</button>' +
                    '<button id="cookie-accept" class="cookie-btn cookie-btn-primary">' + t.accept + '</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(banner);

        document.getElementById('cookie-accept').addEventListener('click', function () {
            setConsent({ necessary: true, analytics: true, marketing: true });
        });
        document.getElementById('cookie-reject').addEventListener('click', function () {
            setConsent({ necessary: true, analytics: false, marketing: false });
        });
        document.getElementById('cookie-config').addEventListener('click', function () {
            hideBanner();
            showConfig();
        });
    }

    function createConfig() {
        var panel = document.createElement('div');
        panel.id = 'cookie-config-panel';
        panel.className = 'cookie-config-hidden';
        panel.innerHTML =
            '<div class="cookie-config-overlay"></div>' +
            '<div class="cookie-config-modal">' +
                '<div class="cookie-config-header">' +
                    '<strong>' + t.config + '</strong>' +
                    '<button id="cookie-config-close" class="cookie-config-close-btn">&times;</button>' +
                '</div>' +
                '<div class="cookie-config-body">' +
                    '<div class="cookie-config-item">' +
                        '<div class="cookie-config-item-header">' +
                            '<span class="cookie-config-item-title">' + t.necessary + '</span>' +
                            '<span class="cookie-config-always">' + t.always + '</span>' +
                        '</div>' +
                        '<p class="cookie-config-item-desc">' + t.necessaryDesc + '</p>' +
                    '</div>' +
                    '<div class="cookie-config-item">' +
                        '<div class="cookie-config-item-header">' +
                            '<span class="cookie-config-item-title">' + t.analytics + '</span>' +
                            '<label class="cookie-toggle"><input type="checkbox" id="cookie-analytics" checked><span class="cookie-toggle-slider"></span></label>' +
                        '</div>' +
                        '<p class="cookie-config-item-desc">' + t.analyticsDesc + '</p>' +
                    '</div>' +
                    '<div class="cookie-config-item">' +
                        '<div class="cookie-config-item-header">' +
                            '<span class="cookie-config-item-title">' + t.marketing + '</span>' +
                            '<label class="cookie-toggle"><input type="checkbox" id="cookie-marketing"><span class="cookie-toggle-slider"></span></label>' +
                        '</div>' +
                        '<p class="cookie-config-item-desc">' + t.marketingDesc + '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="cookie-config-footer">' +
                    '<button id="cookie-save" class="cookie-btn cookie-btn-primary">' + t.save + '</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(panel);

        document.getElementById('cookie-config-close').addEventListener('click', hideConfig);
        panel.querySelector('.cookie-config-overlay').addEventListener('click', hideConfig);
        document.getElementById('cookie-save').addEventListener('click', function () {
            setConsent({
                necessary: true,
                analytics: document.getElementById('cookie-analytics').checked,
                marketing: document.getElementById('cookie-marketing').checked
            });
        });
    }

    function hideBanner() {
        var b = document.getElementById('cookie-banner');
        if (b) b.style.display = 'none';
    }

    function showBanner() {
        var b = document.getElementById('cookie-banner');
        if (b) b.style.display = '';
    }

    function showConfig() {
        var p = document.getElementById('cookie-config-panel');
        if (p) p.classList.remove('cookie-config-hidden');
    }

    function hideConfig() {
        var p = document.getElementById('cookie-config-panel');
        if (p) p.classList.add('cookie-config-hidden');
        // If no consent saved yet, show banner again
        if (!getConsent()) showBanner();
    }

    // Init
    function init() {
        createConfig();
        var consent = getConsent();
        if (consent) {
            applyConsent(consent);
        } else {
            createBanner();
        }

        // Allow reopening config from cookie policy page link
        document.addEventListener('click', function (e) {
            if (e.target && e.target.classList && e.target.classList.contains('cookie-config-trigger')) {
                e.preventDefault();
                showConfig();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
