/* i18n/common.js — 跨頁共用字串（header / nav / footer / skip-link）。鍵值規則見 docs/I18N-SPEC.md 第 4 節。 */
window.I18N = window.I18N || { zh: {}, en: {} };

Object.assign(window.I18N.zh, {
    "common.skip": "跳到主要內容",
    "common.brand.name": "吳弘叡",
    "common.nav.toggle": "開關選單",
    "common.nav.aria": "主要導覽",
    "common.nav.home": "首頁",
    "common.nav.sitemap": "網站導覽",
    "common.nav.introMe": "自我介紹",
    "common.nav.contact": "聯絡我"
});

Object.assign(window.I18N.en, {
    "common.skip": "Skip to main content",
    "common.brand.name": "Hong-Ruei Wu",
    "common.nav.toggle": "Toggle menu",
    "common.nav.aria": "Main navigation",
    "common.nav.home": "Home",
    "common.nav.sitemap": "Sitemap",
    "common.nav.introMe": "About Me",
    "common.nav.contact": "Contact"
});
