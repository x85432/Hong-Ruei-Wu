/*
111652049 吳弘叡 第三次作業 11/1
111652049 Hong-Ruei Wu The Third Homework 11/1
*/
window.onload = function() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
}

close_btns = document.querySelectorAll('.close');
close_btns.forEach(function(btn) {
    btn.onclick = function() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
        document.getElementById('elements').style.display = 'none';
    }
});

document.getElementById('button').onclick = function() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('elements').style.display = 'block';
}

document.getElementById('overlay').onclick = function() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
    document.getElementById('elements').style.display = 'none';
}

// Keyword scale
const keywords = ["吳弘叡", "排球", "陽明交大", "資工", "應數", "臺中二中", "轉系", "隊長", "收栽", "雙主修"];
const textBox = document.querySelector('.text-box');
const paragraphs = textBox.querySelectorAll('p');

let currentHighlight = null;

function shuffleKeywords() {
    for (let i = keywords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keywords[i], keywords[j]] = [keywords[j], keywords[i]];
    }
}


function highlightRandomKeyword(keyword) {
    if (currentHighlight) {
        paragraphs.forEach(paragraph => {
            const text = paragraph.innerHTML;
            const regex = new RegExp(`<span class="highlight">(.*?)<\/span>`, 'g');
            paragraph.innerHTML = text.replace(regex, '$1'); // 替换为原文
        });
    }

    currentHighlight = keyword;

    paragraphs.forEach(paragraph => {
        const text = paragraph.innerHTML;
        const regex = new RegExp(`(${currentHighlight})`, 'g');
        const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
        paragraph.innerHTML = highlightedText;
    });
}


shuffleKeywords();
keywords.forEach((keyword, index) => {
    setTimeout(() => {
        highlightRandomKeyword(keyword);
    }, index * 3000);
});

setInterval(() => {
    shuffleKeywords();
    keywords.forEach((keyword, index) => {
        setTimeout(() => {
            highlightRandomKeyword(keyword);
        }, index * 3000);
    });
}, keywords.length * 3000 + 1000);