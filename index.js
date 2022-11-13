const events = {
  NEW_WORD: "newword",
  GUESSED_LETTER: "guessedletter",
  GUESSED_LETTER_AGAIN: "doubleletterdismiss",
  WIN: "win_the_game",
  GUESSED_WRONG: "wrong",
  LOST: "lost",
};

window.addEventListener(events.GUESSED_LETTER, (event) => {
  console.log("EVENT: new guessed letter");

  document.getElementById("guessinput").value = "";

  if (event.detail.isCorrect) {
    guessCorrect(event);
  } else {
    guessWrong(event);
  }
});

function guessCorrect(event) {
  const correctLetters = document.querySelectorAll(".target-letter");
  correctLetters.forEach((el) => {
    if (el.dataset.letter === event.detail.letter) {
      el.innerHTML = event.detail.letter;
      el.dataset.found = true;
    }
  });

  const foundNodeList = document.querySelectorAll(
    ".target-letter[data-found=true]"
  );

  const isDone = foundNodeList.length === correctLetters.length;
  if (isDone) {
    document.dispatchEvent(new CustomEvent(events.WIN, { bubbles: true }));
  }
}

window.addEventListener(events.WIN, () => {
  document.body.classList.add("game-over");
  document.body.classList.add("won");
});

function guessWrong(event) {
  const guessed = document.querySelector(".guessed-letters");

  // have we guessed this before?
  const checkIfAlreadyGuessed = () => {
    const wrongGuesses = document.querySelectorAll(".guessed-letter");
    const lister = [];

    wrongGuesses.forEach((el) => {
      lister.push(el.innerHTML);
    });

    if (lister.indexOf(event.detail.letter) > -1) {
      return true;
    }
    return false;
  };

  if (checkIfAlreadyGuessed()) {
    // return end
    document.dispatchEvent(
      new CustomEvent(events.GUESSED_LETTER_AGAIN, { bubbles: true })
    );
    return false;
  } else {
    // make wrong
    const guessedLetter = document.createElement("li");
    guessedLetter.className = "guessed-letter";
    guessedLetter.innerHTML = event.detail.letter;
    guessed.appendChild(guessedLetter);
    document.dispatchEvent(
      new CustomEvent(events.GUESSED_WRONG, { bubbles: true })
    );
  }
}

const guessForm = document.querySelector(".guess-form");
guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const guessedLetter = event.target[0].value.toUpperCase();

  const checkLetterIsCorrect = (guessedLetter) => {
    const word = document.querySelector(".target-letters").dataset.word;

    return {
      correct: word.indexOf(guessedLetter) > -1,
      index: word.indexOf(guessedLetter),
    };
  };

  // finns bokstaven i ordet?
  const isCorrect = checkLetterIsCorrect(guessedLetter);

  guessForm.dispatchEvent(
    new CustomEvent(events.GUESSED_LETTER, {
      bubbles: true,
      detail: {
        letter: guessedLetter,
        isCorrect: isCorrect.correct,
        correctIndex: isCorrect.index,
      },
    })
  );
});

window.addEventListener(events.GUESSED_WRONG, (event) => {
  console.log("EVENT: ", event.type, event);

  const ALLOWED_ERRORS = 11;
  const CURRENT_ERRORS =
    document.querySelector(".guessed-letters").childElementCount;
  console.log(CURRENT_ERRORS);

  if (CURRENT_ERRORS > ALLOWED_ERRORS) {
    document.dispatchEvent(new CustomEvent(events.LOST, { bubbles: true }));
  }

  const getClassFromNumberErorrs = (number) => {
    console.log(number);

    switch (number) {
      case 1:
        return "one";
      case 2:
        return "two";
      case 3:
        return "three";
      case 4:
        return "four";
      case 5:
        return "five";
      case 6:
        return "six";
      case 7:
        return "seven";
      case 8:
        return "eight";
      case 9:
        return "nine";
      case 10:
        return "ten";
      case 11:
        return "eleven";
      default:
        return "one";
    }
  };

  const hangman = document.querySelector(".hangman");
  hangman.classList.add(getClassFromNumberErorrs(CURRENT_ERRORS));
});

window.addEventListener(events.LOST, () => {
  document.body.classList.add("game-over");
  document.body.classList.add("lost");
});

window.addEventListener(events.RESET, () => {
  initalState();
});

function initalState() {
  // game-start game-going game-over lost
  document.body.classList = "";
  document.body.classList.add("game-start");

  document.querySelector(".guessed-letters").innerHTML = null;

  // document.getElementById('hanger').classList = ''
  document.getElementById("hanger").classList = "hangman";

  const guessedLetters = document.querySelectorAll(".guessed-letters");
  guessedLetters.innerHTML = "";
}

window.addEventListener(events.NEW_WORD, (event) => {
  console.log("EVENT: made a new word.");

  document.body.classList.add("game-going");
  document.getElementById("word").value = "";
  document.getElementById("stage2").scrollIntoView();
  document.getElementById("guessinput").focus();

  // hitta antal tecken i ordet
  // rita ut streck för varje bokstav
  // draw placeholders
  drawPlaceholder(event.detail.word);
});

function drawPlaceholder(word) {
  const letters = word.split("");

  const targetContainer = document.querySelector(".target-letters");
  targetContainer.dataset.word = word;
  targetContainer.innerHTML = "";

  letters.forEach((letter) => {
    const etter = document.createElement("div");
    etter.className = "target-letter";
    etter.dataset.letter = letter;
    etter.dataset.found = false;

    targetContainer.appendChild(etter);
  });
}

const init = () => {
  // establish events

  // stage 1 enter the word
  const wordForm = document.querySelector(".word-form");
  wordForm.addEventListener("submit", (event) => {
    let word = "";

    event.preventDefault(event);

    word = event.target[0].value;

    wordForm.dispatchEvent(
      new CustomEvent(events.NEW_WORD, {
        bubbles: true,
        detail: { word: event.target[0].value.toUpperCase() },
      })
    );
  });

  document.body.classList.add("game-start");
};

init();

document.addEventListener("click", (event) => {
  if (event.target.classList.value.indexOf("js-restart") > -1) {
    initalState();
  }
});

const externalWordForm = document.querySelector(".external-word-form");
externalWordForm.addEventListener("submit", (event) => {
  event.preventDefault(true);
  console.log();

  const theWord = event.target[0].value;
  const location = window.location.href;
  console.log({ encoded: btoa(theWord), location });

  const share = document.querySelector(".js-share-url-container");
  share.innerHTML =
    "" +
    window.location.origin +
    window.location.pathname +
    "?w=" +
    btoa(theWord);

  document.querySelector(".js-reveal-share").classList.add("is-visible");
});

window.addEventListener("load", function (event) {
  console.log("just loaded site");

  if (!this.window.location.search) {
    console.log("NO SEARCH");
    return false;
  } else {
    console.log("continue");
  }

  // queried game !!
  if (window.location.search.indexOf("?w=") > -1) {
    const value = window.location.search.substring(
      window.location.search.indexOf("?w=") + 3,
      window.location.search.length
    );

    this.window.history.pushState(null, null, window.location.pathname);

    document.dispatchEvent(
      new CustomEvent(events.NEW_WORD, {
        bubbles: true,
        detail: { word: atob(value).toUpperCase() },
      })
    );
  }

  // another game !
  const search = window.location.search;
  if ((search.indexOf("?d=") > -1) & (search.length > 3)) {
    console.log("we got a game on our hands!!");

    const data = search.substring(search.indexOf("?d=") + 3, search.length);

    console.log(decode(data));
  }
});
