/*
111652049 吳弘叡 第三次作業 11/1
111652049 Hong-Ruei Wu The Third Homework 11/1
*/
// Open a new tab
function openNewTab(url) {
    window.open(url, '_blank');
}

// AD functions
function showAd() {
    document.getElementById('ad').style.display = 'block';

    if (document.getElementById('ad').style.display === 'block') {
        timerElement.classList.add('hidden');
    }
}

function closeAd() {
    timerElement.classList.remove('hidden');

    document.getElementById('ad').style.display = 'none';
    setTimeout(showAd, 3000);
}

// AD timer
let timerElement = document.getElementById('timer');
setTimeout(function() {
    let timerStr = document.getElementById('timer');
    let theNum = parseFloat(timerStr.innerText);
    let timer = setInterval(function() {
        theNum += 0.1;
        let intPart = parseInt(theNum);
        intPart = intPart.toString().padStart(4, '0');

        let decimalPart = (theNum % 1).toFixed(1).substring(1);

        timerStr.innerText = intPart + decimalPart + 's';
    }, 100);
}, 100);


// AD
setTimeout(showAd, 3000);
document.getElementById('close').onclick = closeAd;



// topic hover
const topics = document.querySelectorAll('.topic');

topics.forEach(topic => {
    topic.addEventListener('mouseenter', function() {
        topic.style.transform = 'rotate(-5deg)';
        topic.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
            topic.style.transform = 'rotate(5deg)';
        }, 500);
        setTimeout(() => {
            topic.style.transform = 'rotate(0deg)';
        }, 1000);
    })

    topic.addEventListener('mouseleave', function() {
        topic.style.transform = 'rotate(0deg)';
    })
})

// 拔蘿蔔
const carrots = document.querySelectorAll('.carrot');
carrots.forEach(carrot => {
    carrot.addEventListener('click', function() {

        // Create a new carrot
        const draggableCarrot = document.createElement('span');
        draggableCarrot.innerText = '🥕';
        draggableCarrot.classList.add('draggable');
        document.body.appendChild(draggableCarrot);

        const rect = this.getBoundingClientRect();
        draggableCarrot.style.position = 'absolute';
        draggableCarrot.style.top = `${rect.top + window.scrollY}px`;
        draggableCarrot.style.left = `${rect.left + window.scrollX}px`;

        // Carrot drop down
        setTimeout(() => {
            draggableCarrot.style.transition = `top 1.5s ease, left 1.5s ease`;
            const viewportBottom = window.innerHeight - draggableCarrot.offsetHeight; // 視窗底部位置
            draggableCarrot.style.top = `${viewportBottom}px`; // 設定掉落到視窗底部
            let randomOffset = Math.random() * 100 - 10;
            draggableCarrot.style.left = `${rect.left + randomOffset}px`;
        }, 100);

        // Remove original carrot
        this.textContent = '🕳️';
        this.classList.add('dragzone');

        // ===================================================================================================
        // Drag
        let isDragging = false;

        // When mouse down => start dragging
        allCarrots = document.querySelectorAll('.draggable');
        allZones = document.querySelectorAll('.dragzone');
        allCarrots.forEach(d_carrot => {
            d_carrot.addEventListener('mousedown', function (e) {
                isDragging = true;
                d_carrot.style.transition = 'none'; // 取消掉落動畫

                const offsetX = e.clientX - d_carrot.getBoundingClientRect().left;
                const offsetY = e.clientY - d_carrot.getBoundingClientRect().top;

                // Move the carrot with mouse
                const mouseMoveHandler = (e2) => {
                    if (isDragging) {
                        d_carrot.style.left = `${e2.clientX - offsetX}px`;
                        d_carrot.style.top = `${e2.clientY - offsetY}px`;
                    }
                    // Scroll offset
                    if (window.scrollY > 0) {
                        d_carrot.style.top = `${parseInt(d_carrot.style.top) + scrollY}px`;
                    }
                };

                // Release the carrot
                const mouseUpHandler = () => {
                    isDragging = false;
                    d_carrot.style.transition = `top 1.5s ease, left 1.5s ease`;
                    const viewportBottom = window.innerHeight - d_carrot.offsetHeight;
                    d_carrot.style.top = `${viewportBottom}px`; // 掉落到視窗底部

                    // ===================================================================================================
                    // Check if the carrot is back in the hole
                    // 種蘿蔔
                    const carrotRect = d_carrot.getBoundingClientRect();

                    allZones.forEach(zone => {
                        const dropRect = zone.getBoundingClientRect();
                        if (
                            carrotRect.left+30 >= dropRect.left &&
                            carrotRect.right-30 <= dropRect.right &&
                            carrotRect.top+30 >= dropRect.top &&
                            carrotRect.bottom-30 <= dropRect.bottom
                        ) {
                            // Put the carrot back in the hole
                            zone.textContent = '🥕';
                            zone.classList.remove('dragzone');
                            d_carrot.remove();
                        }
                    });

                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                };

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            });
        });
    });
});




