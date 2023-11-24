const wordList = [
  "apple",
  "orange",
  "banana",
  "pizza",
  "playstation",
  "crazy",
  "supercalifragilisticexpialidocious",
]; // Add more words as needed. The last one is to test longer words.

/*  Array that stores the words the player needs to guess in the current game.
    Varies based on the difficulty
    Using preselected values currently in the demo
    In the final version, Olivia will populate this array with the results from Chat GPT*/
let currentWords = [];

/*  Array which will be filled with arrays.
    Keeps track of the player's guesses for each word. 
    Each sub-array in currentGuesses corresponds to one word in currentWords. 
    For example, if currentWords contains three words, then currentGuesses will have three sub-arrays, 
    each storing the guesses for one of those words. This structure helps manage and validate the player's input
    for each specific word they are trying to guess. */
let currentGuesses = [];

/*  
     This variable determines the maximum number of guesses a player can make for each word.
     It is set based on the difficulty level chosen at the start of the game. 
     For instance, in an Easy game, you might allow more guesses (e.g., 6 guesses), 
     whereas in a Hard game, you might limit it to fewer guesses (e.g., 3 guesses). 
     This variable is crucial for controlling the game's difficulty and ensuring that the number of 
     guesses is consistent for each word the player is trying to guess.
*/
let maxGuesses;

// Start the game with a difficulty setting
function startGame(difficulty) {
  switch (difficulty) {
    case "easy":
      maxGuesses = 6;
      currentWords = selectRandomWords(1);
      break;
    case "medium":
      maxGuesses = 4;
      currentWords = selectRandomWords(3);
      break;
    case "hard":
      maxGuesses = 3;
      currentWords = selectRandomWords(5);
      break;
  }

  currentGuesses = currentWords.map(() => []);
  setupGameBoard();
}

// Select random words from the list
function selectRandomWords(numberOfWords) {
  let selectedWords = [];
  for (let i = 0; i < numberOfWords; i++) {
    let randomIndex = Math.floor(Math.random() * wordList.length);
    selectedWords.push(wordList[randomIndex]);
  }
  return selectedWords;
}

// Set up the game board with input fields for guessing
function setupGameBoard() {
  let gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = ""; // Clear previous game board

  currentWords.forEach((word, index) => {
    let wordContainer = document.createElement("div");
    wordContainer.id = `word-${index}`;
    for (let i = 0; i < maxGuesses; i++) {
      let row = document.createElement("div");
      for (let j = 0; j < word.length; j++) {
        let cell = document.createElement("input");
        cell.type = "text";
        cell.maxLength = 1;
        row.appendChild(cell);
      }
      wordContainer.appendChild(row);
    }
    gameBoard.appendChild(wordContainer);
  });

  // Add a submit button for guessing
  let submitButton = document.createElement("button");
  submitButton.textContent = "Submit Guess";
  submitButton.onclick = handleGuess;
  gameBoard.appendChild(submitButton);
}

// Handle the guess and update the game board
function handleGuess() {
  currentWords.forEach((word, index) => {
    let wordContainer = document.getElementById(`word-${index}`);
    let inputs = wordContainer.getElementsByTagName("input");
    let guess = Array.from(inputs)
      .map((input) => input.value)
      .join("");

    if (guess.length === word.length) {
      currentGuesses[index].push(guess);
      updateUI(word, guess, index);
    } else {
      alert("Please enter a complete guess.");
    }
  });
}

// Update the UI based on the guess correctness
function updateUI(word, guess, wordIndex) {
  let wordContainer = document.getElementById(`word-${wordIndex}`);
  let guessIndex = currentGuesses[wordIndex].length - 1;
  let inputs =
    wordContainer.childNodes[guessIndex].getElementsByTagName("input");

  for (let i = 0; i < guess.length; i++) {
    if (word[i] === guess[i]) {
      inputs[i].style.backgroundColor = "green";
    } else if (word.includes(guess[i])) {
      inputs[i].style.backgroundColor = "yellow";
    } else {
      inputs[i].style.backgroundColor = "red";
    }
  }

  // Additional logic to check game status can be implemented here
}

// Additional game logic functions can be added here
