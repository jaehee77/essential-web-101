'use strict';

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();


function initGame() {
    // console.log(fieldRect)
    
    // 벌레와 당근을 생성한뒤 추가해 줌
    addItem('carrot', 5, '../images/carrot.png')
    addItem('bug', 5, '../images/bug.png')

}

function addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width;
    const y2 = fieldRect.height;
}

initGame();