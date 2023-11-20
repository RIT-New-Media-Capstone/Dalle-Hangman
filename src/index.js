let startButton = document.getElementById('start-button');
let startupState = document.getElementById('startup-state');
let gameState = document.getElementById('game-state');
let slider = document.getElementById('difficulty-range');
let wordList = document.getElementById('words');

startButton.onclick = (ev) => {
    gameState.style.display='flex';
    startupState.style.display='none';

    let sliderValue = slider.value;
    console.log(sliderValue);

    for(let i=0; i<sliderValue; i++){
        let element = document.createElement('input');
        element.type='text';
        element.id=`${i+1}word`;
        element.name=`${i+1}word`;
        wordList.appendChild(element);
    }
}