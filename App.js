// src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [thoughts, setThoughts] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('/api/thoughts')
      .then(res => res.json())
      .then(data => setThoughts(data));
  }, []);

  const submitThought = () => {
    if (!input.trim()) return;
    fetch('/api/thoughts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }),
    })
      .then(res => res.json())
      .then(() => {
        setInput('');
        fetch('/api/thoughts')
          .then(res => res.json())
          .then(data => setThoughts(data));
      });
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Share your thoughts or poems</h1>
      <textarea
        rows="4"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Write something..."
        style={{ width: '100%', marginBottom: 10 }}
      />
      <button onClick={submitThought}>Submit</button>

      <h2>Published Thoughts</h2>
      <div>
        {thoughts.length === 0 && <p>No approved thoughts yet.</p>}
        {thoughts.map(thought => (
          <div key={thought._id} style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
            <p>{thought.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
