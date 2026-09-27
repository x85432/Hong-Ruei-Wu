/* ==========================================================================
   sitemap.js — 網站導覽頁專屬互動
   只留拔蘿蔔：用 Pointer Events 支援滑鼠與觸控拖曳。
   ========================================================================== */

(function () {
    "use strict";

    var carrots = document.querySelectorAll(".carrot");
    if (!carrots.length) return;

    var reduceMotion = !!(
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    function setTransform(el, x, y) {
        el.style.transform = "translate(" + x + "px, " + y + "px)";
    }

    function currentTransform(el) {
        var style = window.getComputedStyle(el);
        var transform = style.transform;
        if (!transform || transform === "none") {
            return { x: 0, y: 0 };
        }
        // matrix(a, b, c, d, tx, ty)
        var match = transform.match(/matrix\(([^)]+)\)/);
        if (!match) return { x: 0, y: 0 };
        var parts = match[1].split(",").map(function (n) {
            return parseFloat(n);
        });
        return { x: parts[4] || 0, y: parts[5] || 0 };
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function fallToBottom(el) {
        var rect = el.getBoundingClientRect();
        var targetX = clamp(rect.left, 0, Math.max(0, window.innerWidth - rect.width));
        var targetY = Math.max(0, window.innerHeight - rect.height);

        if (reduceMotion) {
            el.style.transition = "none";
            setTransform(el, targetX, targetY);
            return;
        }

        el.style.transition = "transform 0.6s var(--ease, ease)";
        // 用 rAF 確保 transition 生效在新的 transform 值上
        requestAnimationFrame(function () {
            setTransform(el, targetX, targetY);
        });
    }

    function overlaps(rectA, rectB) {
        return !(
            rectA.right < rectB.left ||
            rectA.left > rectB.right ||
            rectA.bottom < rectB.top ||
            rectA.top > rectB.bottom
        );
    }

    function onPointerMove(event) {
        var drag = event.currentTarget;
        var state = drag.__dragState;
        if (!state || !state.dragging) return;
        var x = event.clientX - state.offsetX;
        var y = event.clientY - state.offsetY;
        setTransform(drag, x, y);
    }

    function onPointerUp(event) {
        var drag = event.currentTarget;
        var state = drag.__dragState;
        if (!state) return;
        state.dragging = false;

        drag.removeEventListener("pointermove", onPointerMove);
        drag.removeEventListener("pointerup", onPointerUp);
        drag.removeEventListener("pointercancel", onPointerUp);
        drag.classList.remove("is-dragging");

        try {
            drag.releasePointerCapture(event.pointerId);
        } catch (err) {
            /* 部分瀏覽器在指標已經放開時呼叫會丟例外，安靜忽略 */
        }

        var dragRect = drag.getBoundingClientRect();
        var holes = document.querySelectorAll(".carrot.is-empty");
        var landed = null;

        holes.forEach(function (hole) {
            if (landed) return;
            if (overlaps(dragRect, hole.getBoundingClientRect())) {
                landed = hole;
            }
        });

        if (landed) {
            landed.textContent = "🥕";
            landed.classList.remove("is-empty");
            landed.setAttribute("aria-label", "拔一根蘿蔔");
            drag.remove();
        } else {
            fallToBottom(drag);
        }
    }

    function onPointerDown(event) {
        var drag = event.currentTarget;
        drag.setPointerCapture(event.pointerId);
        drag.style.transition = "none";
        drag.classList.add("is-dragging");

        var pos = currentTransform(drag);
        drag.__dragState = {
            dragging: true,
            offsetX: event.clientX - pos.x,
            offsetY: event.clientY - pos.y
        };

        drag.addEventListener("pointermove", onPointerMove);
        drag.addEventListener("pointerup", onPointerUp);
        drag.addEventListener("pointercancel", onPointerUp);
    }

    function spawnCarrot(originBtn) {
        originBtn.textContent = "🕳️";
        originBtn.classList.add("is-empty");
        originBtn.setAttribute("aria-label", "蘿蔔已經拔起，可以拖曳蘿蔔回來種下");

        var rect = originBtn.getBoundingClientRect();

        var drag = document.createElement("button");
        drag.type = "button";
        drag.className = "carrot-drag";
        drag.textContent = "🥕";
        drag.setAttribute("aria-hidden", "true");
        drag.tabIndex = -1;
        document.body.appendChild(drag);

        setTransform(drag, rect.left, rect.top);
        drag.addEventListener("pointerdown", onPointerDown);

        // 強制 reflow，確保接下來的 transition 會從目前位置開始播放
        void drag.offsetWidth;
        fallToBottom(drag);
    }

    carrots.forEach(function (btn) {
        btn.addEventListener("click", function () {
            if (btn.classList.contains("is-empty")) return;
            spawnCarrot(btn);
        });
    });

    // 視窗改變大小時，把還在拖曳／掉落中的蘿蔔拉回可視範圍內
    window.addEventListener("resize", function () {
        document.querySelectorAll(".carrot-drag").forEach(function (el) {
            var rect = el.getBoundingClientRect();
            var x = clamp(rect.left, 0, Math.max(0, window.innerWidth - rect.width));
            var y = clamp(rect.top, 0, Math.max(0, window.innerHeight - rect.height));
            el.style.transition = "none";
            setTransform(el, x, y);
        });
    });
})();
