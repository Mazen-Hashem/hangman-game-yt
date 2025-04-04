// select elemets
const startGameBtn = document.querySelector(".start_game");
const gameContainer = document.querySelector(".game_container"),
      hintContent = document.querySelector(".game_container .container_head .hint_content"),
      boxWrongs = Array.from(document.querySelectorAll(".game_container .container_main .box_wrong")),
      keyboardBtns = Array.from(document.querySelectorAll(".game_container .container_main .keyboard_btn")),
      containerFoot = document.querySelector(".game_container .container_foot"),
      resultContent = document.querySelector(".game_container .result_content"),
      resetBtn = document.querySelector(".game_container .reset");
const trueSound = document.querySelector("#true_sound"),
      falseSound = document.querySelector("#false_sound");


// add click event on start game button
startGameBtn.addEventListener("click", fetchData);

// get data, covert it, run random function by this data
async function fetchData() {
  let promise = await fetch("/data/english-words.json");
  let data = await promise.json();
  random(data);
}

function random(data) {
  // get the object
  let obj = data[0];
  // put all key's object in array
  let keysArray = Object.keys(obj);

  // get random key from keysArray
  let randomKeyNum = Math.floor(Math.random() * keysArray.length),
      chosenKey = keysArray[randomKeyNum];

  // get random word from the array that ouned by the chosenKey
  let randomindexNum = Math.floor(Math.random() * obj[chosenKey].length),
      chosenWord = obj[chosenKey][randomindexNum].toUpperCase();
  // console.log(chosenWord);

  // run startGame function
  startGame();
  // run createContent function by the chosenKey and chosenWord
  createContent(chosenKey, chosenWord);
};

// remove active from start game button, add active to game container
function startGame() {
  startGameBtn.classList.remove("active_start_game");
  gameContainer.classList.add("active_game_container");
};

function createContent(key, word) {
  // print the key in p element with upper case the first letter
  let Content = `${key[0].toUpperCase()}${key.slice(1)}`;
  hintContent.innerHTML = Content;

  // create span element, add class and appended it depends on number of letters of the chosen word
  for (let i = 0; i < word.length; i++) {
    const span = document.createElement("span");
    if (word[i] === " ") {
      span.classList.add("foot_space");
    } else {
      span.classList.add("foot_box");
    }
    containerFoot.appendChild(span);
  }

  // delete the space from the word
  let wordNoSpace = word.split(" ").join("");
  // run handleKeyboardBtns by the chosenWord
  handleKeyboardBtns(wordNoSpace, word);
};

function handleKeyboardBtns(wordNoSpace, word) {
  // add click event on each button
  keyboardBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      // disabled the clicked target
      e.target.setAttribute("disabled", true);
      // remove active from the clicked target
      e.target.classList.remove("active_keyboard_btn");
      // run checkAnswer function by the chosenWord, the value of data attr of the clicked target
      checkAnswer(wordNoSpace, e.target.getAttribute("data-letter"), word);
    })
  });
};

// the index of wrong array
let boxWrongIndex = -1;
// the answer of player
let answerValue = "";

function checkAnswer(wordNoSpace, targetLetter, word) {
  // select element
  const footBoxs = Array.from(document.querySelectorAll(".game_container .container_foot .foot_box"));
  // if player won = true, lost = false
  let resultValue;

  // if the clicked letter is inside the chosen word
  if (wordNoSpace.includes(targetLetter)) {
    for (let i = 0; i < wordNoSpace.length; i++) {
      // get the indexs of the right clicked letter in the chosen word => i
      if (wordNoSpace[i] === targetLetter) {
        // use this i to get to the same index in the footBoxs array and print the right clicked letter in it
        footBoxs[i].innerHTML = targetLetter;
        // then add active to it
        footBoxs[i].classList.add("active_foot_box");
        // add the right clicked letter to answerValue
        answerValue += targetLetter;
      }
    }
    // play true sound
    trueSound.play();
    // if number of letters in answerValue is equal to number of letters in the chosen word then player won
    if (answerValue.length === wordNoSpace.length) {
      resultValue = true;
      // run endGame function by true/false, chosen word
      endGame(resultValue, word);
    }
  // if the clicked letter is not inside the chosen word
  } else {
    // +1 the index of the wrong array
    boxWrongIndex++;
    // add active to the new index from the wrong array
    boxWrongs[boxWrongIndex].classList.add("active_box_wrong");
    // play false sound
    falseSound.play();
    // if the value of counter index equal to the number of indexes in the wrong array then player lost
    if (boxWrongIndex === boxWrongs.length - 1) {
      resultValue = false;
      // run endGame function by true/false, chosen word
      endGame(resultValue, word);
    }
  }
};

function endGame(resultValue, word) {
  keyboardBtns.forEach(btn => {
    // disabled all buttons
    btn.setAttribute("disabled", true);
    // remove active from all buttons
    btn.classList.remove("active_keyboard_btn");
  })
  // run showResult function by true/false, chosen word
  showResult(resultValue, word);
};

function showResult(resultValue, word) {
  // if true / false print content in p element
  if (resultValue) {
    resultContent.innerHTML = `congratulations! you won, the word was <span class="content_color">${word}</span>`;
  } else {
    resultContent.innerHTML = `Better luck next time! you lost, the word was <span class="content_color">${word}</span>`;
  }
  // add active on p element
  resultContent.classList.add("active_result_content");
  // run reset function
  reset();
};

function reset() {
  // add click event on reset button to reload the page
  resetBtn.addEventListener("click", _ => {
    location.reload();
  })
  // add active to button element
  resetBtn.classList.add("active_reset");
};
