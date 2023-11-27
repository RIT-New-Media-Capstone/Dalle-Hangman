const wordList = [
  "apple",
  "orange",
  "banana",
  "pizza",
  "playstation",
  "crazy",
  "supercalifragilisticexpialidocious",
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
function startGame(difficulty) {
  let numberOfWords;
  switch (difficulty) {
    case "easy":
      numberOfWords = 1;
      break;
    case "medium":
      numberOfWords = 3;
      break;
    case "hard":
      numberOfWords = 5;
      break;
  }

  currentWords = selectRandomWords(numberOfWords);
  currentGuesses = currentWords.map(() => []);
  setupGameBoard();
}

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
  let gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = ""; // Clear previous game board

  currentWords.forEach((word, index) => {
    let wordContainer = document.createElement("div");
    wordContainer.id = `word-${index}`;
    let row = createInputRow(word.length);
    wordContainer.appendChild(row);
    gameBoard.appendChild(wordContainer);
  });

  // Add a submit button for guessing
  let submitButton = document.createElement("button");
  submitButton.textContent = "Submit Guess";
  submitButton.onclick = handleGuess;
  gameBoard.appendChild(submitButton);
}

// Create a row of input boxes
// Modified this by adding an event listener so that you can actually type smoothly and not have to click or press tab
function createInputRow(wordLength) {
  let row = document.createElement("div");
  for (let j = 0; j < wordLength; j++) {
    let cell = document.createElement("input");
    cell.type = "text";
    cell.maxLength = 1;
    cell.style.width = "20px"; // Again, this is UI stuff. Raine will probably replace it with something much prettier

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
      alert("Please enter a complete guess.");
    }
  });
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
