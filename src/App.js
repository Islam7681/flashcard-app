import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashcardList';
import axios from 'axios';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const categoryEl = useRef();
  const amountEl = useRef();

  // Fetch category list on component mount
  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      });
  }, []);

  // Utility function to decode HTML entities
  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.get('https://opentdb.com/api.php', {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value
        }
      });
      const data = res.data.results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer);
        const options = [
          ...questionItem.incorrect_answers.map(a => decodeString(a)),
          answer
        ];
        return {
          id: `${index}-${Date.now()}`,
          question: decodeString(questionItem.question),
          answer,
          options: options.sort(() => Math.random() - 0.5)
        };
      });
      setFlashcards(data);
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError('Failed to load flashcards. Please try again.');
    }
    setLoading(false);
  }

  function clearFlashcards() {
    setFlashcards([]);
  }

  return (
    <>
      <header className="header">
        <h1>Flashcard App</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" ref={categoryEl}>
              {categories.map(category => (
                <option value={category.id} key={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Number of Questions</label>
            <input 
              type="number" 
              id="amount" 
              min="1" 
              step="1" 
              defaultValue={10} 
              ref={amountEl} 
            />
          </div>
          <button type="submit" className="btn">Generate</button>
          <button 
            type="button" 
            className="btn clear" 
            onClick={clearFlashcards}
          >
            Clear
          </button>
        </form>
      </header>
      <div className="container">
        {loading && <div className="message">Loading flashcards...</div>}
        {error && <div className="message">{error}</div>}
        {flashcards.length > 0 ? (
          <FlashcardList flashcards={flashcards} />
        ) : (
          !loading && <div className="message">No flashcards available. Please generate some!</div>
        )}
      </div>
    </>
  );
}

export default App;