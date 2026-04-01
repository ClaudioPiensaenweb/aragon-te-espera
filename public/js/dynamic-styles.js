(function() {
    fetch('https://admin.aragonteespera.com/items/estilo')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            var s = data.data;
            if (!s) return;

            // Google Fonts
            var fonts = [];
            if (s.font_titles) fonts.push(s.font_titles.replace(/ /g, '+') + ':wght@700');
            if (s.font_body) fonts.push(s.font_body.replace(/ /g, '+') + ':wght@400;500;700');
            if (fonts.length) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=' + fonts.join('&family=') + '&display=swap';
                document.head.appendChild(link);
            }

            var css = ':root {\n';

            // Fonts
            css += '  --font-titles: "' + (s.font_titles || 'Newsreader') + '", serif;\n';
            css += '  --font-body: "' + (s.font_body || 'Plus Jakarta Sans') + '", sans-serif;\n';
            css += '  --font-size-body: ' + (s.font_size_body || 16) + 'px;\n';

            // Title sizes - mobile vertical (base)
            css += '  --titulo-hero: ' + (s.titulo_hero_mv || 42) + 'px;\n';
            css += '  --titulo-1: ' + (s.titulo_1_mv || 34) + 'px;\n';
            css += '  --titulo-2: ' + (s.titulo_2_mv || 28) + 'px;\n';
            css += '  --titulo-3: ' + (s.titulo_3_mv || 22) + 'px;\n';
            css += '  --titulo-4: ' + (s.titulo_4_mv || 18) + 'px;\n';

            // Colors
            css += '  --color-primary: ' + (s.color_primary || '#FF6800') + ';\n';
            css += '  --color-primary-hover: ' + (s.color_primary_hover || '#FF3E00') + ';\n';
            css += '  --color-title: ' + (s.color_title || '#001630') + ';\n';
            css += '  --color-text: ' + (s.color_text || '#2F3B4A') + ';\n';
            css += '  --color-bg-body: ' + (s.color_bg_body || '#FFFFFF') + ';\n';
            css += '  --color-bg-alt: ' + (s.color_bg_section_alt || '#F8F9FA') + ';\n';
            css += '  --color-footer-bg: ' + (s.color_footer_bg || '#001630') + ';\n';
            css += '  --color-accent-warm1: ' + (s.color_accent_warm1 || '#FF3E00') + ';\n';
            css += '  --color-accent-warm2: ' + (s.color_accent_warm2 || '#FF6800') + ';\n';
            css += '  --color-accent-warm3: ' + (s.color_accent_warm3 || '#FFA000') + ';\n';
            css += '  --color-accent-warm4: ' + (s.color_accent_warm4 || '#FFCC00') + ';\n';
            // Buttons
            var primary = s.color_primary || '#FF6800';
            var primaryHover = s.color_primary_hover || '#FF3E00';
            var custom = s.btn_custom_colors;

            css += '  --btn-radius: ' + (s.btn_border_radius || 50) + 'px;\n';
            css += '  --btn-font-size: ' + (s.btn_font_size || 16) + 'px;\n';
            css += '  --btn-padding: ' + (s.btn_padding_y || 12) + 'px ' + (s.btn_padding_x || 25) + 'px;\n';
            css += '  --btn-uppercase: ' + (s.btn_uppercase ? 'uppercase' : 'none') + ';\n';
            css += '  --btn-border-width: ' + (s.btn_border_width || 1) + 'px;\n';
            css += '  --btn-filled-bg: ' + (custom ? (s.btn_filled_bg || primary) : primary) + ';\n';
            css += '  --btn-filled-text: ' + (custom ? (s.btn_filled_text || '#FFFFFF') : '#FFFFFF') + ';\n';
            css += '  --btn-filled-bg-hover: ' + (custom ? (s.btn_filled_bg_hover || primaryHover) : primaryHover) + ';\n';
            css += '  --btn-outline-border: ' + (custom ? (s.btn_outline_border || primary) : primary) + ';\n';
            css += '  --btn-outline-text: ' + (custom ? (s.btn_outline_text || primary) : primary) + ';\n';
            css += '  --btn-outline-bg-hover: ' + (custom ? (s.btn_outline_bg_hover || primary) : primary) + ';\n';
            css += '  --btn-outline-text-hover: ' + (custom ? (s.btn_outline_text_hover || '#FFFFFF') : '#FFFFFF') + ';\n';

            css += '}\n';

            // Responsive title sizes
            css += '@media (min-width: 479px) { :root {\n';
            css += '  --titulo-hero: ' + (s.titulo_hero_mh || 46) + 'px;\n';
            css += '  --titulo-1: ' + (s.titulo_1_mh || 38) + 'px;\n';
            css += '  --titulo-2: ' + (s.titulo_2_mh || 30) + 'px;\n';
            css += '  --titulo-3: ' + (s.titulo_3_mh || 23) + 'px;\n';
            css += '  --titulo-4: ' + (s.titulo_4_mh || 19) + 'px;\n';
            css += '}}\n';

            css += '@media (min-width: 768px) { :root {\n';
            css += '  --titulo-hero: ' + (s.titulo_hero_tb || 50) + 'px;\n';
            css += '  --titulo-1: ' + (s.titulo_1_tb || 40) + 'px;\n';
            css += '  --titulo-2: ' + (s.titulo_2_tb || 34) + 'px;\n';
            css += '  --titulo-3: ' + (s.titulo_3_tb || 24) + 'px;\n';
            css += '  --titulo-4: ' + (s.titulo_4_tb || 20) + 'px;\n';
            css += '}}\n';

            css += '@media (min-width: 992px) { :root {\n';
            css += '  --titulo-hero: ' + (s.titulo_hero_dk || 60) + 'px;\n';
            css += '  --titulo-1: ' + (s.titulo_1_dk || 48) + 'px;\n';
            css += '  --titulo-2: ' + (s.titulo_2_dk || 40) + 'px;\n';
            css += '  --titulo-3: ' + (s.titulo_3_dk || 27) + 'px;\n';
            css += '  --titulo-4: ' + (s.titulo_4_dk || 21) + 'px;\n';
            css += '}}\n';

            // Apply dynamic styles using CSS variables
            css += 'body { font-family: var(--font-body); color: var(--color-text); background-color: var(--color-bg-body); font-size: var(--font-size-body); }\n';
            css += '.titulo-hero, .titulo-1, .titulo-2, .titulo-3, .titulo-4 { font-family: var(--font-titles); color: var(--color-title); }\n';
            css += '.titulo-hero { font-size: var(--titulo-hero); }\n';
            css += '.titulo-1 { font-size: var(--titulo-1); }\n';
            css += '.titulo-2 { font-size: var(--titulo-2); }\n';
            css += '.titulo-3 { font-size: var(--titulo-3); }\n';
            css += '.titulo-4 { font-size: var(--titulo-4); }\n';
            css += '.btn { border-radius: var(--btn-radius); font-size: var(--btn-font-size); padding: var(--btn-padding); text-transform: var(--btn-uppercase); }\n';
            css += '.btn-filled { background-color: var(--btn-filled-bg); color: var(--btn-filled-text); }\n';
            css += '.btn-filled:hover { background-color: var(--btn-filled-bg-hover); }\n';
            css += '.btn-outline { border: var(--btn-border-width) solid var(--btn-outline-border); color: var(--btn-outline-text); }\n';
            css += '.btn-outline:hover { background-color: var(--btn-outline-bg-hover); color: var(--btn-outline-text-hover); }\n';

            var style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        })
        .catch(function(err) { console.error('Error loading styles:', err); });

    // Load favicon and logo from empresa
    fetch('https://admin.aragonteespera.com/items/empresa?fields=favicon,logotipo')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            var e = data.data;
            if (!e) return;
            // Favicon
            if (e.favicon) {
                var link = document.querySelector('link[rel="icon"]');
                if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
                link.href = 'https://admin.aragonteespera.com/assets/' + e.favicon + '?width=32&height=32';
            }
            // Logo - update all logo images
            if (e.logotipo) {
                document.querySelectorAll('.logo-img').forEach(function(img) {
                    img.src = 'https://admin.aragonteespera.com/assets/' + e.logotipo;
                });
            }
        }).catch(function(){});

    // Load SEO meta from Directus
    var currentPath = window.location.pathname;
    if (currentPath.length > 1 && currentPath.endsWith('/')) currentPath = currentPath.slice(0, -1);
    if (currentPath === '') currentPath = '/';
    fetch('https://admin.aragonteespera.com/items/seo?filter[slug][_eq]=' + encodeURIComponent(currentPath) + '&limit=1')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            var seo = data.data && data.data[0];
            if (!seo) return;
            if (seo.meta_title) document.title = seo.meta_title;
            if (seo.meta_description) {
                var meta = document.querySelector('meta[name="description"]');
                if (meta) meta.setAttribute('content', seo.meta_description);
            }
        }).catch(function(){});
})();
