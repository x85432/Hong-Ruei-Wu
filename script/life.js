/*
111652049 吳弘叡 第三次作業 11/1
111652049 Hong-Ruei Wu The Third Homework 11/1
*/
const allSpotlights = document.querySelectorAll('.spotlight');
allSpotlights.forEach(spotlight => {
    spotlight.addEventListener('mouseleave', function () {
        const img = this.querySelector('img');
        img.style.transform = "scale(1)"; // 恢復原始大小
    });
    spotlight.addEventListener('mousemove', function (e) {
        const img = this.querySelector('img');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 設定 transform-origin 為滑鼠所在位置
        img.style.transformOrigin = `${x}px ${y}px`;
        img.style.transform = "scale(3)"; // 放大倍數
    });
})