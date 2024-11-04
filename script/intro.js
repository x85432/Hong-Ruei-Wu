/*
111652049 吳弘叡 第三次作業 11/1
111652049 Hong-Ruei Wu The Third Homework 11/1
*/
const container = document.querySelector(".container");
const [first_section, ...sections] = document.querySelectorAll(".section");
const revealPoint = window.innerHeight * 0.2; // 設定為視窗高度的 20vh

sections.forEach(section => {
    section.classList.add("hidden");
});

container.addEventListener("scroll", () => {
    console.log("scroll");
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top - container.getBoundingClientRect().top;

        if (sectionTop <= revealPoint) {
            section.classList.add("visible");
        }
    });
});