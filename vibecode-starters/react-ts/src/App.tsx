import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem' }}>
      <h1>⚡ Vibe Code Editor</h1>
      <p>React + TypeScript starter template</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: '0.5rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '8px',
          border: 'none',
          background: '#E93F3F',
          color: 'white',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >
        Count is {count}
      </button>
      <p style={{ marginTop: '1rem', color: '#888' }}>
        Edit <code>src/App.tsx</code> and save to see changes
      </p>
    </div>
  )
}

export default App
