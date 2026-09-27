/*
 * script/i18n.js — 語言判定、字典套用、語言切換、站內連結改寫。
 * 規格：docs/I18N-SPEC.md 第 2、6 節。
 *
 * 載入位置：<head> 內、所有 CSS 之後、i18n/common.js 與 i18n/<slug>.js 之後
 * （見規格第 6 節）。本檔案分兩段執行：
 *   1. 立即執行（<head> 解析到這一行就跑）：判定語言、設定 <html lang/data-lang>、
 *      若為 en 就注入 i18n-pending 樣式，避免閃動（第 6.2 節）。
 *   2. DOMContentLoaded 之後：套用字典、設定語言切換鈕、改寫站內連結、
 *      注入 hreflang alternate、移除 i18n-pending。
 */
(function () {
    "use strict";

    var STORAGE_KEY = "site-lang";

    function isValidLang(v) {
        return v === "zh" || v === "en";
    }

    // --- 語言來源解析（第 2 節）---------------------------------------

    // 不用 URLSearchParams（規格第 2 節相容性要求），用正規表達式解析。
    function readQueryLang() {
        var m = /(?:\?|&)lang=([^&]*)/.exec(location.search);
        if (!m) return null;
        try {
            return decodeURIComponent(m[1]);
        } catch (e) {
            return null;
        }
    }

    function readHashLang() {
        var m = /(?:^#|&)lang=([^&]*)/.exec(location.hash);
        if (!m) return null;
        try {
            return decodeURIComponent(m[1]);
        } catch (e) {
            return null;
        }
    }

    function readStoredLang() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function writeStoredLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            // Safari 無痕模式等環境會丟 QuotaExceededError，安靜降級即可。
        }
    }

    // 依第 2 節的優先順序判定語言。回傳 { lang, explicit }：
    // explicit 為 true 代表這次判定來自使用者「主動指定」的來源
    // （查詢字串或雜湊），值得寫回 localStorage 記住。
    function detectLang() {
        var fromQuery = readQueryLang();
        if (isValidLang(fromQuery)) {
            return { lang: fromQuery, explicit: true };
        }

        var fromHash = readHashLang();
        if (isValidLang(fromHash)) {
            return { lang: fromHash, explicit: true };
        }

        var stored = readStoredLang();
        if (isValidLang(stored)) {
            return { lang: stored, explicit: false };
        }

        if (navigator.language && navigator.language.indexOf("zh") !== 0) {
            return { lang: "en", explicit: false };
        }

        return { lang: "zh", explicit: false };
    }

    // 把目前網址同步成能反映實際語言的網址（只在判定來源不是查詢字串時才有意義，
    // 因為查詢字串本來就已經是對的）。用 history.replaceState 不觸發導覽；
    // 失敗（部分 file:// 環境會丟 SecurityError）就退回 location.hash（第 2 節）。
    function syncUrl(lang) {
        if (lang !== "en") return;
        if (/(?:\?|&)lang=/.test(location.search)) return;

        var newSearch = location.search
            ? location.search + "&lang=en"
            : "?lang=en";
        var newUrl = location.pathname + newSearch + location.hash;

        try {
            history.replaceState(null, "", newUrl);
        } catch (e) {
            location.hash = "lang=en";
        }
    }

    var detected = detectLang();
    var currentLang = detected.lang;

    if (detected.explicit) {
        writeStoredLang(currentLang);
    } else {
        syncUrl(currentLang);
    }

    document.documentElement.setAttribute(
        "lang",
        currentLang === "en" ? "en" : "zh-Hant"
    );
    document.documentElement.setAttribute("data-lang", currentLang);

    // 第 6.2 節：只有 en 需要遮蓋替換過程，zh 是原始碼裡的文字，零成本、不遮蓋。
    // 樣式由這裡注入而非寫進 css/，因為 JS 掛掉時這條規則必須不存在，
    // 否則頁面會永久空白（見 docs/I18N-SPEC.md 第 6.2 節）。
    if (currentLang === "en") {
        document.documentElement.classList.add("i18n-pending");
        var pendingStyle = document.createElement("style");
        pendingStyle.setAttribute("data-i18n-pending-style", "");
        pendingStyle.textContent =
            "html.i18n-pending body { visibility: hidden; }";
        document.head.appendChild(pendingStyle);
    }

    // --- 字典套用（DOMContentLoaded 之後）------------------------------

    function applyTextNodes(dict) {
        var nodes = document.querySelectorAll("[data-i18n]");
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            var key = el.getAttribute("data-i18n");
            if (Object.prototype.hasOwnProperty.call(dict, key)) {
                el.textContent = dict[key];
            }
        }
    }

    function applyHtmlNodes(dict) {
        var nodes = document.querySelectorAll("[data-i18n-html]");
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            var key = el.getAttribute("data-i18n-html");
            if (Object.prototype.hasOwnProperty.call(dict, key)) {
                el.innerHTML = dict[key];
            }
        }
    }

    // data-i18n-<attr> 一般化屬性套用。html 是保留字，走 applyHtmlNodes，
    // 這裡要排除，避免重複處理（第 3.3 節）。
    //
    // el.attributes 是 live 的 NamedNodeMap：如果邊遍歷邊 setAttribute 一個
    // 原本不存在的屬性，會改變這個 map 的長度與索引，導致後面的屬性被跳過
    // （目前每個 data-i18n-<attr> 旁邊都有 fallback 屬性所以只會取代不會
    // 新增，實際上碰不到，但這份程式碼會被其他頁面沿用，所以先蒐集成一份
    // 靜態陣列，跑完蒐集再套用，兩個階段不交錯）。
    function applyAttrNodes(dict) {
        var all = document.querySelectorAll("*");
        var pending = [];
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            var attrs = el.attributes;
            for (var j = 0; j < attrs.length; j++) {
                var name = attrs[j].name;
                var m = /^data-i18n-(.+)$/.exec(name);
                if (!m || m[1] === "html") continue;
                pending.push({
                    el: el,
                    targetAttr: m[1],
                    key: attrs[j].value,
                });
            }
        }
        for (var k = 0; k < pending.length; k++) {
            var item = pending[k];
            if (Object.prototype.hasOwnProperty.call(dict, item.key)) {
                item.el.setAttribute(item.targetAttr, dict[item.key]);
            }
        }
    }

    function applyDictionary(lang) {
        var dict = (window.I18N && window.I18N[lang]) || {};
        applyTextNodes(dict);
        applyHtmlNodes(dict);
        applyAttrNodes(dict);
    }

    // --- 語言切換鈕（第 6.3 節）-----------------------------------------

    // 把目前路徑 + 查詢字串的 lang 參數換成 targetLang 該有的樣子：
    // en 帶 ?lang=en，zh 帶 ?lang=zh——兩邊都要明確帶參數，不能讓 zh 用
    // 「乾淨網址」表示，否則「乾淨網址＝我沒指定」會被 localStorage 裡
    // 殘留的 en 蓋過去，使用者按了「中」卻還是拿到英文（docs/I18N-SPEC.md
    // 第 6.3 節的修正記錄）。
    function buildSwitchHref(targetLang) {
        var search = location.search;
        var parts = [];
        if (search) {
            var raw = search.replace(/^\?/, "").split("&");
            for (var i = 0; i < raw.length; i++) {
                if (raw[i] && !/^lang=/.test(raw[i])) {
                    parts.push(raw[i]);
                }
            }
        }
        parts.push(targetLang === "en" ? "lang=en" : "lang=zh");
        var newSearch = parts.length ? "?" + parts.join("&") : "";
        return location.pathname + newSearch;
    }

    function setupLangSwitch(lang) {
        var el = document.querySelector("[data-lang-switch]");
        if (!el) return;

        var targetLang = lang === "zh" ? "en" : "zh";
        var targetHreflang = targetLang === "en" ? "en" : "zh-Hant";

        el.setAttribute("href", buildSwitchHref(targetLang));
        el.setAttribute("hreflang", targetHreflang);
        el.setAttribute("lang", targetHreflang);
        // EN / 中 是目標語言的切換鈕標籤，是設定不是字典鍵
        // （規格第 6.3 節：字典裡放「zh 字典裡的 EN」這種條目會反直覺）。
        el.textContent = targetLang === "en" ? "EN" : "中";
    }

    // --- 站內連結補 ?lang=en（第 6.3 節）--------------------------------

    function rewriteInternalLinks(lang) {
        if (lang !== "en") return;

        var links = document.querySelectorAll("a[href]");
        for (var i = 0; i < links.length; i++) {
            var a = links[i];
            if (a.hasAttribute("data-lang-switch")) continue;

            var href = a.getAttribute("href");
            if (!href) continue;
            if (/^https?:\/\//i.test(href)) continue;
            if (/^mailto:/i.test(href)) continue;
            if (/^#/.test(href)) continue;
            if (href.indexOf("volleyball/") !== -1) continue;
            if (!/\.html(?:[?#]|$)/i.test(href)) continue;
            if (/(?:\?|&)lang=/.test(href)) continue;

            var sep = href.indexOf("?") === -1 ? "?" : "&";
            a.setAttribute("href", href + sep + "lang=en");
        }
    }

    // --- hreflang alternate（第 6.1 節第 6 項）--------------------------

    function injectAlternateLinks() {
        var basePath = location.pathname;

        var zhLink = document.createElement("link");
        zhLink.setAttribute("rel", "alternate");
        zhLink.setAttribute("hreflang", "zh-Hant");
        zhLink.setAttribute("href", basePath);
        document.head.appendChild(zhLink);

        var enLink = document.createElement("link");
        enLink.setAttribute("rel", "alternate");
        enLink.setAttribute("hreflang", "en");
        enLink.setAttribute("href", basePath + "?lang=en");
        document.head.appendChild(enLink);
    }

    document.addEventListener("DOMContentLoaded", function () {
        // i18n-pending 一旦加上就必須移除，否則 en 頁面永久空白（第 6.2 節
        // 本來要避開的失效模式）。用 finally 保證無論上面哪一步丟例外都會
        // 移除；不在這裡加 catch 吞掉例外，讓它照常浮到 console，方便除錯。
        try {
            applyDictionary(currentLang);
            setupLangSwitch(currentLang);
            rewriteInternalLinks(currentLang);
            injectAlternateLinks();
        } finally {
            document.documentElement.classList.remove("i18n-pending");
        }
    });
})();
