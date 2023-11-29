let startButton = document.getElementById('start-button');
let startupState = document.getElementById('startup-state');
let gameState = document.getElementById('game-state');
let slider = document.getElementById('difficulty-range');
let wordcontainer = document.getElementById('words');
let submitButton = document.getElementById('submit-button');
let guessError = document.getElementById('guess-error');
let promptTopic = document.getElementById('fcategory');
let dalleImage = document.getElementById('dalle-image');
let guessesNeeded = false;

const wordsToRemove = ['create', 'an', 'image', 'picture', 'scene', 'of', 'with', 'make', 'generate',
  'show', 'design', 'visualize', 'construct', 'depict', 'render', 'compose', 'illustrate',
  'rendering', 'artwork', 'representation', 'illustration', 'photo', 'photograph', 'an',
  'the', 'is', 'of', 'with', 'in', 'on', 'at', 'by', 'to',
  'and', 'or', 'for', 'from', 'as', 'featuring'];


startButton.onclick = async (ev) => {
  gameState.style.display = 'flex';
  startupState.style.display = 'none';
  let sliderValue = slider.value;
  if (promptTopic.value === '') {
    await generatePromptRequest(sliderValue, 'anything');
  } else { await generatePromptRequest(sliderValue, promptTopic.value); }
  console.log(sliderValue);
  console.log(promptTopic.value);
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
    wordContainer.style.marginRight = '4rem';
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
    //UI changes to style each box and make it nice
    cell.style.margin = '0rem;'
    cell.style.width = "1.2rem";
    cell.style.height = '1.2rem';
    cell.style.fontSize = '1.2rem';
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
};

const openaiApiKey = 'REPLACE WITH YOUR OWN';//REPLACE WITH YOUR OWN KEY
const apiUrlPrompt = 'https://api.openai.com/v1/chat/completions';
const apiUrlImage = 'https://api.openai.com/v1/images/generations';
async function generatePromptRequest(numberOfWords, promptTopic) {
  const requestData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: `give me a ${numberOfWords} word DALLE2 prompt involving ${promptTopic}, ${wordsToRemove} don't count towards the number limit. Dont use words like genrate and Dalle2`//selected words
        }
      ]
    })
  };
  return fetch(apiUrlPrompt, requestData)
    .then(response => response.json())
    .then(data => {
      currentWords = data.choices[0].message.content.split(/\s+/)
        .map(word => word.replace(/["',.!?]/g, '').toLowerCase())
        .filter(word => !wordsToRemove.includes(word) && word.trim() !== '');  // Remove words in wordsToRemove and any empty strings
      currentGuesses = currentWords.map(() => []);
      console.log(data.choices[0].message.content);
      generateImage(data.choices[0].message.content);
    })// Extracting the content from the response
    .catch(error => {
      console.error('Error:', error);
      throw error; // Propagate the error for handling downstream if needed
    });
};



async function generateImage(prompt) {
  const requestData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    })
  };
  return fetch(apiUrlImage, requestData)
    .then(response => response.json())
    .then(data => {
      // Handle the response data here
      console.log(data.data[0].url);
      setupGameBoard();
      //dalleImage.removeAttribute('src');
      dalleImage.src= data.data[0].url;
      //dalleImage.href = data.data[0].url;

      //grab img src and made null or zero,
      //change img href to data.data[0].url
    })
    .catch(error => {
      // Handle errors here
      console.error('Error:', error);
    });
};
