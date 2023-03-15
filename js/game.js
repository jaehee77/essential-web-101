'use strict';

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpRefresh = document.querySelector('.pop-up__refresh');
const popUpText = document.querySelector('.pop-up__message');


// 게임의 상태를 기억하고 있어야 하는 변수 설정
let started = false; // 게임이 시작되었는지 아닌지 판별
let score = 0; // 최종적인 점수를 기억
let timer = undefined; // 총 얼마만의 시간이 남았는지(게임이 시작되지 않으면 timer 가 없다가 시작되면 설정)

field.addEventListener('click', onFieldClick)

gameBtn.addEventListener('click', () => {
    if(started) {
        stopGame();
    } else {
        startGame();
    }
})

popUpRefresh.addEventListener('click', () => {
    startGame();
    hidePopUp();
})

function startGame() {
    started = true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
}

function stopGame() {
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY?');
}

function finishGame(win) {
    started = false;
    hideGameButton();
    showPopUpWithText(win ? 'YOU WON ^.^' : 'YOU LOST ㅠㅠ');
}

function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    
    timer = setInterval(() => {
        if(remainingTimeSec <= 0 ) {
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000);
}
function stopGameTimer() {
    clearInterval(timer);
}

function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes} : ${seconds}`;
}

function showStopButton() {
    const icon = gameBtn.querySelector('.fas');
    icon.classList.remove('fa-play');
    icon.classList.add('fa-stop');
}

function hideGameButton() {
    gameBtn.style.visibility = 'hidden';
}


function showTimerAndScore() {
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

function showPopUpWithText(text) {
    popUpText.innerText = text;
    popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
    popUp.classList.add('pop-up--hide');
}

function initGame() {
    score = 0;
    field.innerHTML = '';
    gameScore.innerText = CARROT_COUNT;
    // console.log(fieldRect)
    
    // 벌레와 당근을 생성한뒤 추가해 줌
    // const carrotLength = randomNumber(1, 10);
    // const bugLength = randomNumber(1, 10);
    addItem('carrot', CARROT_COUNT, './images/carrot.png');
    addItem('bug', BUG_COUNT, './images/bug.png');

}

function onFieldClick(evt) {
    if(!started) {
        return;
    }
    // console.log(evt)

    const target = evt.target;
    // matches : css 셀렉터가 해당하는지 판별
    if(target.matches('.carrot')) {
        // 당근
        target.remove();
        score++;
        updateScoreBoard();
        if(score === CARROT_COUNT) {
            finishGame(true);
        }
    } else if(target.matches('.bug')){
        stopGameTimer();
        finishGame(false);
    }
}

function updateScoreBoard() {
    gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;

    for(let i = 0; i < count; i++) {
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.position = 'absoulte';
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
