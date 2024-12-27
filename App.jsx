import React from "react";
import { createRoot } from "react-dom";
import clsx from "clsx";
import Confetti from "react-confetti";
import { getFarewellText, getRandomWord } from "./components/utils";
import { languages } from "./components/language";

const root = createRoot(document.getElementById("root"));

function App() {
  const [currentWord, setCurrentWord] = React.useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = React.useState([]);

  const wrongGuessesCount=guessedLetters.filter((letter)=> !currentWord.includes(letter)).length
  const isGameWon=currentWord.split("").every((letter)=> guessedLetters.includes(letter))
  const isGameLost=wrongGuessesCount>=languages.length-1
  const isGameOver=isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetters) => prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]  );
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  const languageElements = languages.map((lang,index) => {
    const isLanguageLost=index<wrongGuessesCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    const className=clsx("chip",isLanguageLost && "lost")
    return (
      <span key={lang.name} className={className} style={styles}>
        {lang.name}
      </span>
    );
  });

  const letterElements = currentWord
    .split("")
    .map((letter, index) => {
        const shouldRevelLetter=isGameLost || guessedLetters.includes(letter)
        const letterClassName=clsx(isGameLost && !guessedLetters.includes(letter) && "missed-letter")
        return (
        <span className={letterClassName} key={index}>{shouldRevelLetter ? letter.toUpperCase() : ""}</span>
    )});

    const gameStatusClass=clsx("game-status" , {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

  return (
    <main>
        {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header>
        <h1>Assemble: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the Avengers world safe from
          Assemply!
        </p>
      </header>
      <section className={gameStatusClass}>
        {isGameOver && (
            isGameWon ? (
            <>
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
            </>
            ) : (
            <>
                <h2>You lose!</h2>
                <p>Try again! Better start watching Dora The Explorer😭</p>
            </>
            )
        )}
        {isLastGuessIncorrect && !isGameOver && <p className="farewell-message">{getFarewellText(languages[wrongGuessesCount-1].name)}</p>}
    </section>

      <section className="language-chips">{languageElements}</section>
      <section className="word">{letterElements}</section>
      <section className="keyboard">
        {alphabet.split("").map((letter, index) => {
            const isGuessed = guessedLetters.includes(letter)
            const isCorrect = isGuessed && currentWord.includes(letter)
            const isWrong = isGuessed && !currentWord.includes(letter)
            const className=clsx({
                correct: isCorrect,
                wrong: isWrong
            })

            return (
                <button className={className} onClick={() => addGuessedLetter(letter)} key={index}>
                    {letter.toUpperCase()}
                </button>
        )})}
      </section>
      {isGameOver && <button onClick={startNewGame} className="new-game">New Game</button>}
    </main>
  );
}

root.render(<App />);
export default App;