/*Get all elements for script functionality*/
let gen_num = generateNumber();
const nameInput = document.getElementById("name");
const startButton = document.getElementById("start");
const gameDiv = document.getElementById("game");
const nameDiv = document.getElementById("userName");
const playerSpan = document.getElementById("player");
const guessInput = document.getElementById("guess");
const submitButton = document.getElementById("submit");
const resultP = document.getElementById("result");
const numGuessesSpan = document.getElementById("num-guesses");
const historyList = document.getElementById("history");
const newGameButton = document.getElementById("new-game");
const cardText = document.getElementById("recorder");
let numGuesses = 0;
let history = [];
let starTime;

/*Display the top recorder*/
let topRecorder = JSON.parse(localStorage.getItem("bestScore"));

if (topRecorder) {
  cardText.innerHTML = `${topRecorder.name}</br>No. of guesses : ${topRecorder.guesses}
              </br>Time taken : ${topRecorder.time} ms `;
} else {
  cardText.innerHTML = "Make a record ...";
}

/*Start button functionality*/
startButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (name === "") {
    alert("Please enter your name.");
    return;
  }

  playerSpan.textContent = name;
  nameDiv.style.display = "none";
  gameDiv.style.display = "block";
  nameInput.value = "";
  // Start time
  starTime = new Date().getTime();
  guessInput.focus();
});

/*Submit guessed value function*/
submitButton.addEventListener("click", () => {
  const guess = guessInput.value.trim();

  // 4 digit validation by Regex
  if (!/^\d{4}$/.test(guess)) {
    alert("Please enter a four-digit number.");
    return;
  }

  // Compare the number and generate the result
  const result = compareNumbers(gen_num, guess);
  resultP.textContent = result;
  numGuesses++;
  numGuessesSpan.textContent = numGuesses;

  // Guessed values and it's results stored locally & displayed
  history.push({ number: guess, result });
  historyList.innerHTML = history
    .map((h) => `<li>${h.number} :  ${h.result}</li>`)
    .join("");

  // If User guessed correct value
  if (result === "++++") {
    // End time & resultent time calculation
    let endTime = new Date().getTime();
    let resTime = endTime - starTime;

    // Finding best score in comparisation with previous one
    const bestScores = JSON.parse(localStorage.getItem("bestScore"));

    if (bestScores) {
      // Best score : based on min time & min guesses
      if (numGuesses <= bestScores.guesses && resTime < bestScores.time) {
        const score = {
          name: playerSpan.textContent,
          guesses: numGuesses,
          time: resTime,
        };

        // Best score stored / updated in local storage
        localStorage.setItem("bestScore", JSON.stringify(score));

        alert(
          `Congratulations, ${playerSpan.textContent}! You guessed the number in ${numGuesses} tries.
                Time taken : ${resTime} ms.
            Your score is : ${result}. *Best Score `
        );
        newGameButton.click();
      } else {
        alert(
          `Congratulations, ${playerSpan.textContent}! You guessed the number in ${numGuesses} tries.
                Time taken : ${resTime} ms.
            Your score is : ${result}.
            The best score is ${bestScores.guesses} guesses by ${bestScores.name} and Time taken : ${bestScores.time} ms.`
        );
        newGameButton.click();
      }
    } else {
      //If No best score in storage, take the current score and store it
      const score = {
        name: playerSpan.textContent,
        guesses: numGuesses,
        time: resTime,
      };
      localStorage.setItem("bestScore", JSON.stringify(score));
      alert(
        `Congratulations, ${playerSpan.textContent}! You guessed the number in ${numGuesses} tries.
              Time taken : ${resTime} ms.
            Your score is : ${result}.`
      );
      newGameButton.click();
    }
  } else {
    guessInput.value = "";
    guessInput.focus();
  }
});

/*New game button event*/
newGameButton.addEventListener("click", () => {
  location.reload();
});

/*Display the top score, when page getting reload*/
window.addEventListener("load", () => {
  const bestScore = JSON.parse(localStorage.getItem("bestScore"));
  if (bestScore) {
    alert(
      `              Top Scorer : ${bestScore.name}
             Gusses : ${bestScore.guesses} & Time taken : ${bestScore.time} ms.`
    );
  }
});

/*System generate random number*/
function generateNumber() {
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const number = [];
  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * digits.length);
    number.push(digits[index]);
    digits.splice(index, 1);
  }
  console.log("System generated No. :" + number.join(""));
  return number.join("");
}

/*Comparing the numbers*/
function compareNumbers(secretNumber, guess) {
  /* Showing results in exact position */
  let res_score = [];
  for (let i = 0; i < 4; i++) {
    if (guess[i] === secretNumber[i]) {
      res_score.push("+");
    } else if (secretNumber.includes(guess[i])) {
      res_score.push("-");
    } else {
      res_score.push("*");
    }
  }
  return res_score.join("");

  /* Showing results in shuffled position */

  // let plus = 0;
  // let minus = 0;
  // let star = 0;
  // for (let i = 0; i < 4; i++) {
  //   if (guess[i] === secretNumber[i]) {
  //     plus++;
  //   } else if (secretNumber.includes(guess[i])) {
  //     minus++;
  //   } else {
  //     star++;
  //   }
  // }
  // return "+".repeat(plus) + "-".repeat(minus) + "*".repeat(star);
}
