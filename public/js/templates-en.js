function renderHeader() {
    var header = document.getElementById('main-header');
    if (!header) return;
    header.innerHTML = '<div class="max-w-[1700px] mx-auto px-section flex justify-between items-center gap-responsive relative z-[10]"><a href="/en" class="shrink-0 transition-all duration-300 z-[10]"><img src="/marca/aragon-te-espera-logo.png" alt="Aragón te espera" class="logo-img h-[70px] w-auto brightness-0 invert transition-all duration-300"></a><nav class="hidden dk:flex items-center gap-[40px] absolute left-1/2 -translate-x-1/2"><a href="/en" class="nav-link text-white font-jakarta font-[500] text-[16px] transition-colors duration-300">Home</a><a href="/en/about-us" class="nav-link text-white font-jakarta font-[500] text-[16px] transition-colors duration-300">About us</a><a href="/en/services" class="nav-link text-white font-jakarta font-[500] text-[16px] transition-colors duration-300">Services</a><a href="/en/collaborate" class="nav-link text-white font-jakarta font-[500] text-[16px] transition-colors duration-300">Collaborate</a><a href="/en/news" class="nav-link text-white font-jakarta font-[500] text-[16px] transition-colors duration-300">News</a></nav><div class="flex items-center gap-[20px] shrink-0 z-[10]"><div id="lang-switcher" class="relative group"><button class="nav-link text-white flex items-center gap-[5px] font-[500] hover:opacity-80 transition-colors duration-300 cursor-pointer"><i data-lucide="globe" class="w-[18px] h-[18px]"></i> EN <i data-lucide="chevron-down" class="w-[12px] h-[12px] opacity-60 transition-transform duration-300 group-hover:rotate-180"></i></button><div class="absolute right-0 top-[100%] pt-[8px] hidden group-hover:block z-[200]"><div class="bg-white rounded-base shadow-lg py-[8px] min-w-[150px] border border-gray-100"><a href="/" data-lang-switch="es" class="flex items-center gap-[10px] px-[15px] py-[8px] font-jakarta text-[14px] text-text/70 hover:bg-gray-50 hover:text-title transition-colors"><span class="font-bold">ES</span> Español</a><a href="/en" class="flex items-center gap-[10px] px-[15px] py-[8px] font-jakarta text-[14px] text-title font-[600] bg-gray-50"><span class="text-primary font-bold">EN</span> English <svg class="w-[14px] h-[14px] ml-auto text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></a></div></div></div><a href="#footer-section" class="btn btn-filled hidden dk:inline-flex scroll-to-footer">Contact</a><button id="mobile-toggle" class="dk:hidden nav-link text-white"><i data-lucide="menu" class="w-[28px] h-[28px] mobile-icon-open"></i><i data-lucide="x" class="w-[28px] h-[28px] mobile-icon-close hidden"></i></button></div></div><div id="mobile-menu" class="dk:hidden fixed inset-0 bg-accent-cold1 z-[1] flex flex-col justify-center items-center gap-[30px] transition-all duration-500 opacity-0 pointer-events-none translate-y-[-20px]"><a href="/en" class="font-jakarta font-[500] text-[22px] text-white hover:text-primary transition-colors">Home</a><a href="/en/about-us" class="font-jakarta font-[500] text-[22px] text-white hover:text-primary transition-colors">About us</a><a href="/en/services" class="font-jakarta font-[500] text-[22px] text-white hover:text-primary transition-colors">Services</a><a href="/en/collaborate" class="font-jakarta font-[500] text-[22px] text-white hover:text-primary transition-colors">Collaborate</a><a href="/en/news" class="font-jakarta font-[500] text-[22px] text-white hover:text-primary transition-colors">News</a><a href="#footer-section" class="font-jakarta font-[500] text-[22px] text-white hover:text-primary transition-colors scroll-to-footer">Contact</a></div>';
    var toggle = document.getElementById('mobile-toggle');
    var menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            var isOpen = menu.classList.contains('pointer-events-none');
            if (isOpen) { menu.classList.remove('opacity-0','pointer-events-none','translate-y-[-20px]'); menu.classList.add('opacity-100','pointer-events-auto','translate-y-0'); toggle.querySelector('.mobile-icon-open').classList.add('hidden'); toggle.querySelector('.mobile-icon-close').classList.remove('hidden'); }
            else { menu.classList.add('opacity-0','pointer-events-none','translate-y-[-20px]'); menu.classList.remove('opacity-100','pointer-events-auto','translate-y-0'); toggle.querySelector('.mobile-icon-open').classList.remove('hidden'); toggle.querySelector('.mobile-icon-close').classList.add('hidden'); }
        });
    }
    initLangSwitcher();
}
function renderFooter() {
    var footer = document.getElementById('footer-section');
    if (!footer) return;
    footer.innerHTML = '<div class="container-boxed px-section pt-[80px] dk:pt-[120px] pb-[40px]"><div class="max-w-[800px] mb-[60px]"><h2 class="titulo-2 !text-white">Get in touch</h2><p class="texto-base text-white/80">Tell us what you need and we will prepare a tailored proposal.</p></div><div id="footer-contact" class="grid grid-cols-1 tb:grid-cols-3 gap-responsive mb-[60px]"><a href="mailto:" id="footer-email-link" class="flex flex-col items-start group"><div class="w-[50px] h-[50px] rounded-full bg-white/10 flex items-center justify-center text-white mb-[20px] group-hover:scale-110 group-hover:bg-primary transition-all"><i data-lucide="mail" class="w-[24px] h-[24px]"></i></div><span id="footer-email" class="font-jakarta font-bold text-white group-hover:text-primary transition-colors"></span></a><a href="tel:" id="footer-phone-link" class="flex flex-col items-start group"><div class="w-[50px] h-[50px] rounded-full bg-white/10 flex items-center justify-center text-white mb-[20px] group-hover:scale-110 group-hover:bg-primary transition-all"><i data-lucide="phone" class="w-[24px] h-[24px]"></i></div><span id="footer-phone" class="font-jakarta font-bold text-white group-hover:text-primary transition-colors"></span></a><a href="#" id="footer-address-link" target="_blank" rel="noopener noreferrer" class="flex flex-col items-start group"><div class="w-[50px] h-[50px] rounded-full bg-white/10 flex items-center justify-center text-white mb-[20px] group-hover:scale-110 group-hover:bg-primary transition-all"><i data-lucide="map-pin" class="w-[24px] h-[24px]"></i></div><span id="footer-address" class="font-jakarta font-bold text-white group-hover:text-primary transition-colors"></span></a></div><div id="kit-digital-banner" class="mb-[60px]" style="display:none"></div><div class="flex flex-col tb:flex-row justify-between items-center pt-[30px] border-t border-white/10 gap-[20px]"><div class="flex flex-wrap items-center gap-[15px] dk:gap-[30px]"><a href="/en/legal-notice" class="font-jakarta text-[14px] text-white/70 hover:text-white transition-colors">Legal notice</a><a href="/en/privacy-policy" class="font-jakarta text-[14px] text-white/70 hover:text-white transition-colors">Privacy policy</a><a href="/en/cookie-policy" class="font-jakarta text-[14px] text-white/70 hover:text-white transition-colors">Cookie policy</a></div><a href="https://piensaenweb.com/" target="_blank" rel="noopener noreferrer" class="font-jakarta text-[14px] text-white/70 hover:text-white transition-colors">Web development by Piensaenweb</a></div></div>';
}
function initLangSwitcher() {
    var a = document.querySelector('[data-lang-switch="es"]');
    if (!a) return;
    var p = window.location.pathname.replace(/^\/en\/?/, '/');
    // Blog category: link to noticias archive
    if (p.match(/^\/news\/categoria\//)) { a.href = '/noticias'; return; }
    // Blog single: will be updated by blog-single.js after loading the post
    if (p.match(/^\/news\/.+/)) { a.href = '/noticias'; }
    var map = {'about-us':'quienes-somos','services':'servicios','collaborate':'colabora','news':'noticias','legal-notice':'aviso-legal','privacy-policy':'politica-de-privacidad','cookie-policy':'politica-de-cookies'};
    Object.keys(map).forEach(function(k) { p = p.replace(k, map[k]); });
    if (p === '/') p = '/';
    a.href = p;
}
function checkNoindex() {
    var slug = window.location.pathname;
    if (slug === '/en/' || slug === '/en') slug = '/en';
    fetch('http://localhost:8055/items/seo?fields=seo_data&filter[slug][_eq]='+encodeURIComponent(slug)+'&filter[language][_eq]=en&limit=1',{headers:{'Authorization':'Bearer aragon-admin-token'}})
        .then(function(r){return r.json()})
        .then(function(data){
            var item = data.data && data.data[0];
            if (item && item.seo_data && item.seo_data.no_index === true) {
                var meta = document.querySelector('meta[name="robots"]');
                if (!meta) { meta = document.createElement('meta'); meta.name = 'robots'; document.head.appendChild(meta); }
                meta.setAttribute('content', 'noindex, follow');
            }
        }).catch(function(){});
}
document.addEventListener('DOMContentLoaded', function() {
    renderHeader();
    renderFooter();
    checkNoindex();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    fetch('http://localhost:8055/items/empresa').then(function(r){return r.json()}).then(function(data){var e=data.data;if(!e)return;var el=document.getElementById('footer-email');var lk=document.getElementById('footer-email-link');var ph=document.getElementById('footer-phone');var pl=document.getElementById('footer-phone-link');var ad=document.getElementById('footer-address');var al=document.getElementById('footer-address-link');if(el)el.textContent=e.correo_electronico||'';if(lk)lk.href='mailto:'+(e.correo_electronico||'');if(ph)ph.textContent=e.telefono||'';if(pl)pl.href='tel:'+(e.telefono||'').replace(/\s/g,'');if(ad)ad.textContent=e.direccion_fiscal||'';if(al&&e.enlace_google_maps)al.href=e.enlace_google_maps;var kb=document.getElementById('kit-digital-banner');if(kb&&e.kit_digital){kb.style.display='block';kb.innerHTML='<div class="bg-white rounded-[12px] p-[20px] dk:p-[30px] inline-block"><img src="/img/kit-digital.png" alt="Programa Kit Digital cofinanciado por los fondos Next Generation EU" class="max-w-full h-auto max-h-[100px]"></div>'}}).catch(function(){});
    document.querySelectorAll('.scroll-to-footer').forEach(function(link){link.addEventListener('click',function(e){e.preventDefault();var menu=document.getElementById('mobile-menu');var toggle=document.getElementById('mobile-toggle');if(menu&&!menu.classList.contains('pointer-events-none')){menu.classList.add('opacity-0','pointer-events-none','translate-y-[-20px]');menu.classList.remove('opacity-100','pointer-events-auto','translate-y-0');if(toggle){toggle.querySelector('.mobile-icon-open').classList.remove('hidden');toggle.querySelector('.mobile-icon-close').classList.add('hidden')}}document.documentElement.scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'})})});
});
