let startButton = document.getElementById('start-button');
let startupState = document.getElementById('startup-state');
let gameState = document.getElementById('game-state');
let slider = document.getElementById('difficulty-range');
let wordcontainer = document.getElementById('words');
let submitButton = document.getElementById('submit-button');
let guessError = document.getElementById('guess-error');
let guessesNeeded = false;

startButton.onclick = (ev) => {
    gameState.style.display='flex';
    startupState.style.display='none';

    let sliderValue = slider.value;
    console.log(sliderValue);

    // for(let i=0; i<sliderValue; i++){
        // let element = document.createElement('input');
        // element.type='text';
        // element.id=`${i+1}word`;
        // element.name=`${i+1}word`;
        // wordcontainer.appendChild(element);
    // }

    currentWords = selectRandomWords(sliderValue);
    currentGuesses = currentWords.map(() => []);
    setupGameBoard();



}

submitButton.onclick = handleGuess;

const wordList = [
    "apple",
    "orange",
    "banana",
    "pizza",
    "playstation",
    "crazy",
    "sap",
  ];
  
  /*  Array that stores the words the player needs to guess in the current game.
  Varies based on the difficulty
  Using preselected values currently in the demo
  In the final version, Olivia will populate this array with the results from Chat GPT
  ...... at which point you probably don't want it to be a const. */
  
  let currentWords = [];
  
  /*  Array which will be filled with arrays.
      Keeps track of the player's guesses for each word. 
      Each sub-array in currentGuesses corresponds to one word in currentWords. 
      For example, if currentWords contains three words, then currentGuesses will have three sub-arrays, 
      each storing the guesses for one of those words. This structure helps manage and validate the player's input
      for each specific word they are trying to guess. */
  let currentGuesses = [];
  
  // Start the game with a difficulty setting screen, this currently does not disappear even though it should
  // Change these values if you need to, number of words for each difficulty decided here
  // Call to setup game board also happens here

  
  // Select random words from the list
  // Absolutely useless for y'all. Its for testing. Delete this function in final version and replace with Chat GPT
  function selectRandomWords(numberOfWords) {
    let selectedWords = [];
    for (let i = 0; i < numberOfWords; i++) {
      let randomIndex = Math.floor(Math.random() * wordList.length);
      selectedWords.push(wordList[randomIndex]);
    }
    return selectedWords;
  }
  
  // Set up the game board with initial input fields
  function setupGameBoard() {
    let gameBoard = document.getElementById("words");
    gameBoard.innerHTML = ""; // Clear previous game board
  
    currentWords.forEach((word, index) => {
      let wordContainer = document.createElement("div");
      wordContainer.id = `word-${index}`;
      wordContainer.style.backgroundColor = '#e8e8e8';
      wordContainer.style.borderRadius = '5px';
      wordContainer.style.padding = '5px';
      wordContainer.style.marginBottom = '5px';
      wordContainer.style.marginRight = '10px';
      wordContainer.style.borderStyle = 'none';
      let row = createInputRow(word.length);
      wordContainer.appendChild(row);
      gameBoard.appendChild(wordContainer);
    });
  
  }
  
  // Create a row of input boxes
  // Modified this by adding an event listener so that you can actually type smoothly and not have to click or press tab
  function createInputRow(wordLength) {
    let row = document.createElement("div");
    // row.style.padding = '5px';
    // row.style.backgroundColor = '#';
    for (let j = 0; j < wordLength; j++) {
      let cell = document.createElement("input");
      cell.type = "text";
      cell.maxLength = 1;
      cell.style.margin = '0rem;'
      cell.style.width = "1rem"; // Again, this is UI stuff. Raine will probably replace it with something much prettier
      cell.style.borderTopStyle = 'none';
      cell.style.borderBottomStyle = 'none';
      cell.style.borderLeftWidth = '0.01rem';
      cell.style.borderRightWidth = '0.01rem';
      cell.style.backgroundColor = 'lightgray';
  
      // Add an event listener to move focus to the next input box
      cell.addEventListener("input", (event) => {
        if (event.target.value.length === event.target.maxLength) {
          let nextCell = event.target.nextElementSibling;
          if (nextCell) {
            nextCell.focus();
          }
        }
      });
  
      row.appendChild(cell);
    }
    return row;
  }
  
  // Handle the guess and update the game board
  function handleGuess() {
    currentWords.forEach((word, index) => {
      let wordContainer = document.getElementById(`word-${index}`);
      let lastRow = wordContainer.lastChild;
      let inputs = lastRow.getElementsByTagName("input");
      let guess = Array.from(inputs)
        .map((input) => input.value)
        .join("");
  
      if (guess.length === word.length) {
        currentGuesses[index].push(guess);
        updateUI(word, guess, index);
        if (guess !== word) {
          wordContainer.appendChild(createInputRow(word.length)); // Add a new row for the next guess
        }
      } else {
        guessesNeeded = true;
      }
    });
    guessError.style.display = guessesNeeded ? 'block' : "none";
    guessesNeeded = false;

  }
  
  // Update the UI based on the guess correctness
  function updateUI(word, guess, wordIndex) {
    let wordContainer = document.getElementById(`word-${wordIndex}`);
    let guessIndex = currentGuesses[wordIndex].length - 1;
  
    // Ensure the guessIndex is within the bounds of childNodes
    if (guessIndex < wordContainer.childNodes.length) {
      let inputs =
        wordContainer.childNodes[guessIndex].getElementsByTagName("input");
  
      for (let i = 0; i < guess.length; i++) {
        if (word[i] === guess[i]) {
          inputs[i].style.backgroundColor = "green";
        } else if (word.includes(guess[i])) {
          inputs[i].style.backgroundColor = "yellow";
        } else {
          inputs[i].style.backgroundColor = "gray";
        }
      }
    } else {
      console.error("Error: guessIndex out of bounds in updateUI");
    }
  }
  