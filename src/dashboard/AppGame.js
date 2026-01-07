import React, { useState } from "react";
// import "./AppGame.css";

const WORD = "HELLO";
const MAX_WRONG = 5;
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AppGame() {
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const handleGuess = (letter) => {
    if (gameOver || guessedLetters.includes(letter)) return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (WORD.includes(letter)) {
      setScore((prev) => prev + 1);
    } else {
      setWrongCount((prev) => {
        const next = prev + 1;
        if (next >= MAX_WRONG) {
          setGameOver(true);
        }
        return next;
      });
    }
  };

  const maskedWord = WORD.split("").map((char) =>
    guessedLetters.includes(char) ? char : "_"
  );

  // Check win condition
  React.useEffect(() => {
    if (!maskedWord.includes("_")) {
      setWin(true);
      setGameOver(true);
    }
  }, [guessedLetters]);

  const resetGame = () => {
    setGuessedLetters([]);
    setScore(0);
    setWrongCount(0);
    setGameOver(false);
    setWin(false);
  };

  return (
    <div style={styles.container}>
      <h1>Letter Guessing Game</h1>

      <div style={styles.word}>
        {maskedWord.map((c, i) => (
          <span key={i} style={styles.letter}>
            {c}
          </span>
        ))}
      </div>

      <div style={styles.info}>
        <p>Score: {score}</p>
        <p>Wrong Attempts: {wrongCount} / {MAX_WRONG}</p>
      </div>

      <div style={styles.grid}>
        {ALPHABETS.map((letter) => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter) || gameOver}
            style={{
              ...styles.button,
              backgroundColor: guessedLetters.includes(letter)
                ? WORD.includes(letter)
                  ? "#4caf50"
                  : "#f44336"
                : "#e0e0e0",
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      {gameOver && (
        <div style={styles.result}>
          <h2>{win ? "🎉 You Win!" : "❌ Game Over"}</h2>
          <button onClick={resetGame} style={styles.reset}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial",
  },
  word: {
    fontSize: "32px",
    letterSpacing: "10px",
    marginBottom: "20px",
  },
  letter: {
    display: "inline-block",
    width: "30px",
  },
  info: {
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "10px",
    maxWidth: "400px",
    margin: "0 auto",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
  },
  reset: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
