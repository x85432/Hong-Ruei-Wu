/* ==========================================================================
   school.js — 臺中二中介紹頁的輪播控制
   輪播本身用純 CSS（radio + :checked ~ 兄弟選擇器）運作，沒有 JS 也能點圓點切換。
   這支 script 只補兩件事：
     1. 左右（上下）方向鍵切換，並把 focus 移到新選取的那張。
     2. 目前這張的圓點加上 aria-current="true"，方便螢幕閱讀器辨識。
   找不到 .carousel 就安靜跳過。
   ========================================================================== */

(function () {
    "use strict";

    var carousels = document.querySelectorAll("[data-carousel]");
    if (!carousels.length) return;

    carousels.forEach(function (carousel) {
        var radios = Array.prototype.slice.call(
            carousel.querySelectorAll('input[type="radio"].carousel__radio')
        );
        if (!radios.length) return;

        function updateCurrent() {
            radios.forEach(function (radio) {
                var dot = carousel.querySelector('.carousel__dot[for="' + radio.id + '"]');
                if (!dot) return;
                if (radio.checked) {
                    dot.setAttribute("aria-current", "true");
                } else {
                    dot.removeAttribute("aria-current");
                }
            });
        }

        function goTo(index) {
            var target = radios[(index + radios.length) % radios.length];
            if (!target) return;
            target.checked = true;
            target.dispatchEvent(new Event("change", { bubbles: true }));
            target.focus();
        }

        radios.forEach(function (radio) {
            radio.addEventListener("change", updateCurrent);
        });

        // 方向鍵：preventDefault 蓋掉瀏覽器原生的 radio group 導覽，
        // 改用我們自己的 goTo()，避免跟原生行為互相打架、跳兩格。
        carousel.addEventListener("keydown", function (event) {
            var currentIndex = radios.findIndex(function (radio) {
                return radio.checked;
            });
            if (currentIndex === -1) return;

            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                goTo(currentIndex + 1);
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                goTo(currentIndex - 1);
            }
        });

        updateCurrent();
    });
})();
