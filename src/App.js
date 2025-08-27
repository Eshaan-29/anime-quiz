import React, { useState } from "react";
import { questions, characters } from "./quizData";
import "./App.css";

function App() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState({});
  const [history, setHistory] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);

  function handleAnswerClick(optionIdx) {
    setSelectedIdx(optionIdx);
  }

  function handleNext() {
    const matches = questions[step].options[selectedIdx].matches;
    let newScore = { ...score };
    matches.forEach((c) => (newScore[c] = (newScore[c] || 0) + 1));
    setScore(newScore);
    setHistory([...history, selectedIdx]);
    setSelectedIdx(null);
    setStep(step + 1);
  }

  function handleBack() {
    if (step === 0) return;
    const lastIdx = history[history.length - 1];
    const lastMatches = questions[step - 1].options[lastIdx].matches;
    let newScore = { ...score };
    lastMatches.forEach((c) => {
      newScore[c] = (newScore[c] || 1) - 1;
      if (newScore[c] === 0) delete newScore[c];
    });
    setScore(newScore);
    setHistory(history.slice(0, -1));
    setStep(step - 1);
    setSelectedIdx(history[history.length - 1] ?? null); // Restore previous choice
  }

  // Result screen with donation button
  if (step >= questions.length) {
    const values = Object.values(score);
    let topChar, c;
    if (values.length === 0) {
      topChar = Object.keys(characters)[0];
      c = characters[topChar];
    } else {
      const maxScore = Math.max(...values);
      const topChars = Object.keys(score).filter(
        (key) => score[key] === maxScore
      );
      topChar = topChars[Math.floor(Math.random() * topChars.length)];
      c = characters[topChar];
    }

    function shareTwitter() {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(
        `I got ${topChar}! Find out which anime character you are!`
      );
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${url}`
      );
    }

    function shareReddit() {
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(
        `I got ${topChar}! Find out which anime character you are!`
      );
      window.open(
        `https://www.reddit.com/submit?url=${url}&title=${title}`
      );
    }

    return (
      <div className="app-container">
        <div className="result-card">
          <h2>Your Anime Persona:</h2>
          <div id="character-name">{topChar}</div>
          <img id="character-image" src={c.image} alt={topChar} />
          <p id="character-description">{c.description}</p>
          <button
            id="restart-btn"
            onClick={() => {
              setScore({});
              setStep(0);
              setHistory([]);
              setSelectedIdx(null);
            }}
          >
            Start Over
          </button>
          <div style={{ marginTop: "24px" }}>
            <button
              style={{
                marginRight: 16,
                background: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 20px",
                fontWeight: "bold",
                marginBottom: 8,
                cursor: "pointer",
              }}
              onClick={shareTwitter}
            >
              Share on Twitter
            </button>
            <button
              style={{
                background: "#ff4500",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 20px",
                fontWeight: "bold",
                marginBottom: 8,
                cursor: "pointer",
              }}
              onClick={shareReddit}
            >
              Share on Reddit
            </button>
          </div>
          {/* Donation button */}
          <a
            href="https://buymeacoffee.com/ashforyou"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              margin: "22px 0 10px 0",
              background: "#FFDD00",
              color: "#000",
              borderRadius: "10px",
              padding: "15px 30px",
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: "1.15em",
              boxShadow: "0 4px 18px rgba(0,0,0,0.10)",
              letterSpacing: "0.5px"
            }}
          >
            ☕ Buy Me a Coffee
          </a>
        </div>
      </div>
    );
  }

  // Progress and question variables
  const progress = Math.round(((step) / questions.length) * 100);
  const q = questions[step];

  return (
    <div className="app-container">
      <div className="question-card">
        <h1>Anime Personality Quiz</h1>
        {/* Progress bar */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <h2>Question {step + 1}/{questions.length}</h2>
        <p className="quiz-question" style={{ marginBottom: "18px", fontSize: "1.1em", fontWeight: 500 }}>{q.question}</p>
        <div className="answer-options">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`answer-btn${selectedIdx === i ? " selected" : ""}`}
              onClick={() => handleAnswerClick(i)}
              style={{ cursor: "pointer" }}
            >
              {opt.text}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          <button
            onClick={handleBack}
            disabled={step === 0}
            style={{
              background: "#6366f1",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              padding: "0.7rem 1.5rem",
              opacity: step === 0 ? 0.6 : 1,
              cursor: step === 0 ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              fontSize: "1.05em",
              marginRight: 10
            }}
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={selectedIdx === null}
            style={{
              background: "#6366f1",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              padding: "0.7rem 1.5rem",
              opacity: selectedIdx === null ? 0.6 : 1,
              cursor: selectedIdx === null ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              fontSize: "1.05em"
            }}
          >
            Next Question →
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
