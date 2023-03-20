'use strict';

// 상수
const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 7;

// 게임 필드
const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

// 팝업
const popUp = document.querySelector('.pop-up');
const popUpText = popUp.querySelector('.pop-up__message');
const popUpRefresh = popUp.querySelector('.pop-up__refresh');

let started = false;
let score = 0;
let timer = undefined;

const carrotSound = new Audio('../sound/carrot_pull.mp3');
const alertSound = new Audio('../sound/alert.wav');
const bgSound = new Audio('../sound/bg.mp3');
const bugSound = new Audio('../sound/bug_pull.mp3');
const winSound = new Audio('../sound/game_win.mp3');



field.addEventListener('click', onFiledClick);

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
});

// 게임 시작시 로직
function startGame() {
    started = true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
}

function showStopButton() {
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility = 'visible';
}
function showTimerAndScore() {
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}
function startGameTimer() {
   let remainingTimeSec = GAME_DURATION_SEC;
   updateTimerText(remainingTimeSec);
   timer = setInterval(() => {
        if(remainingTimeSec <= 0) {
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
   }, 1000);
}
function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60); // 60초를 나누고 난 남은 값이 초
    gameTimer.innerText = `${minutes} : ${seconds}`;
}


// 게임 중지시 로직
function stopGame() {
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY ??');
    playSound(alertSound);
    stopSound(bgSound);
}
function stopGameTimer() {
    clearInterval(timer);
}
function hideGameButton() {
    gameBtn.style.visibility = 'hidden';
}
function showPopUpWithText(text) {
    popUp.classList.remove('pop-up--hide');
    popUpText.innerText = text;
}
function hidePopUp() {
    popUp.classList.add('pop-up--hide');
}

function initGame() {
    // console.log(fieldRect);
    score = 0;
    field.innerHTML = '';
    gameScore.innerText = CARROT_COUNT;

    addItem('carrot', CARROT_COUNT, '../images/carrot.png');
    addItem('bug', BUG_COUNT, '../images/bug.png');
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
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function finishGame(win) {
    started = false;
    hideGameButton();
    if(win) {
        playSound(winSound);
    } else {
        playSound(bugSound);
    }

    stopSound(bgSound);
    stopGameTimer();
    showPopUpWithText(win ? 'YOU WON 💯' : 'YOU LOST 💥');
}


function onFiledClick(event) {
    if(!started) return;

    const target = event.target;

    if(target.matches('.carrot')) {
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if(score === CARROT_COUNT) {
            finishGame(true);
        }
    } else if(target.matches('.bug')) {
        
        finishGame(false);
    }
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}
function stopSound(sound) {
    sound.pause();
}
function updateScoreBoard() {
    gameScore.innerText = CARROT_COUNT - score;
}

// initGame();