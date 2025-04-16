import React, { useState } from 'react';

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      setFlip(!flip);
    }
  }

  return (
    <div 
      className={`card ${flip ? 'flip' : ''}`} 
      onClick={() => setFlip(!flip)}
      role="button" 
      tabIndex="0"
      onKeyDown={handleKeyDown}
      aria-pressed={flip}
    >
      <div className="card-inner">
        <div className="card-face front">
          <h3>{flashcard.question}</h3>
          <div className="flashcard-options">
            {flashcard.options.map(option => (
              <div className="flashcard-option" key={option}>
                {option}
              </div>
            ))}
          </div>
        </div>
        <div className="card-face back">
          <p>{flashcard.answer}</p>
        </div>
      </div>
    </div>
  );
}