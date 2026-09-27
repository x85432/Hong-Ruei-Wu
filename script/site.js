/* ==========================================================================
   site.js — 全站共用互動邏輯
   三個獨立功能：漢堡選單／`.reveal` 進場動畫／Lightbox。
   原生 JS、無框架，放在 body 結尾載入。任一功能用到的元素不存在時
   都要安靜跳過，不能丟出錯誤。
   ========================================================================== */

(function () {
    "use strict";

    /* ======================================================================
       1. 漢堡選單
       ====================================================================== */
    (function initNavToggle() {
        var toggle = document.querySelector(".nav-toggle");
        if (!toggle) return;

        var navId = toggle.getAttribute("aria-controls");
        var nav = navId ? document.getElementById(navId) : document.querySelector(".site-nav");
        if (!nav) return;

        function openNav() {
            nav.classList.add("is-open");
            toggle.setAttribute("aria-expanded", "true");
        }

        function closeNav(returnFocus) {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            if (returnFocus) {
                toggle.focus();
            }
        }

        toggle.addEventListener("click", function () {
            var isOpen = nav.classList.contains("is-open");
            if (isOpen) {
                closeNav(false);
            } else {
                openNav();
            }
        });

        // 按 Escape 關閉，並把焦點還給漢堡按鈕
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && nav.classList.contains("is-open")) {
                closeNav(true);
            }
        });

        // 點選單外部關閉
        document.addEventListener("click", function (event) {
            if (!nav.classList.contains("is-open")) return;
            var target = event.target;
            if (nav.contains(target) || toggle.contains(target)) return;
            closeNav(false);
        });

        // 視窗放大到 ≥768px 時自動關閉並清掉狀態
        window.addEventListener("resize", function () {
            if (window.innerWidth >= 768 && nav.classList.contains("is-open")) {
                closeNav(false);
            }
        });
    })();

    /* ======================================================================
       2. `.reveal` 進場動畫
       ====================================================================== */
    (function initReveal() {
        var items = document.querySelectorAll(".reveal");
        if (!items.length) return;

        if (!("IntersectionObserver" in window)) {
            // 不支援時直接全部顯示，避免內容永久隱形
            items.forEach(function (el) {
                el.classList.add("is-visible");
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );

        items.forEach(function (el) {
            observer.observe(el);
        });
    })();

    /* ======================================================================
       3. Lightbox
       ====================================================================== */
    (function initLightbox() {
        var triggers = document.querySelectorAll("[data-lightbox] .lightbox-trigger");
        if (!triggers.length) return;

        var lightbox = null;
        var lightboxImg = null;
        var lightboxCaption = null;
        var closeButton = null;
        var lastTrigger = null;

        function buildLightbox() {
            lightbox = document.createElement("div");
            lightbox.className = "lightbox";
            lightbox.setAttribute("role", "dialog");
            lightbox.setAttribute("aria-modal", "true");
            // 依 <html lang> 切換可存取名稱，英文頁與中文頁共用同一支 site.js
            var isEnglish = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
            lightbox.setAttribute("aria-label", isEnglish ? "Image preview" : "圖片預覽");
            lightbox.hidden = true;

            var figure = document.createElement("figure");
            figure.className = "lightbox__figure";

            lightboxImg = document.createElement("img");
            lightboxImg.className = "lightbox__img";

            lightboxCaption = document.createElement("figcaption");
            lightboxCaption.className = "lightbox__caption";

            closeButton = document.createElement("button");
            closeButton.type = "button";
            closeButton.className = "lightbox__close";
            closeButton.innerHTML = '<span aria-hidden="true">&times;</span><span class="sr-only">關閉</span>';
            closeButton.addEventListener("click", closeLightbox);

            figure.appendChild(closeButton);
            figure.appendChild(lightboxImg);
            figure.appendChild(lightboxCaption);
            lightbox.appendChild(figure);

            // 點遮罩本身（非圖片本身）關閉
            lightbox.addEventListener("click", function (event) {
                if (event.target === lightbox) {
                    closeLightbox();
                }
            });

            document.body.appendChild(lightbox);
        }

        function openLightbox(trigger) {
            var img = trigger.querySelector("img");
            if (!img) return;

            if (!lightbox) buildLightbox();

            lastTrigger = trigger;

            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt || "";

            var figure = trigger.closest("figure");
            var figcaption = figure ? figure.querySelector("figcaption") : null;
            var captionText = figcaption ? figcaption.textContent.trim() : "";
            lightboxCaption.textContent = captionText;
            lightboxCaption.hidden = captionText === "";

            lightbox.hidden = false;
            document.body.classList.add("has-modal");
            closeButton.focus();

            document.addEventListener("keydown", onKeydown);
        }

        function closeLightbox() {
            if (!lightbox || lightbox.hidden) return;
            lightbox.hidden = true;
            document.body.classList.remove("has-modal");
            document.removeEventListener("keydown", onKeydown);
            if (lastTrigger) {
                lastTrigger.focus();
                lastTrigger = null;
            }
        }

        function onKeydown(event) {
            if (event.key === "Escape") {
                closeLightbox();
                return;
            }
            if (event.key === "Tab") {
                // 對話框內目前只有關閉鈕一個可聚焦元素，攔截 Tab 讓焦點留在原地，
                // 避免焦點跑到被遮罩蓋住的背景頁面連結上。
                event.preventDefault();
                closeButton.focus();
            }
        }

        triggers.forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                openLightbox(trigger);
            });
        });
    })();
})();
