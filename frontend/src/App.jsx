import { useState } from 'react'

function App() {
  const [claim, setClaim] = useState('')

  return (
    <main className="app-shell">
      <p className="eyebrow">TRUTH-LENS</p>
      <h1>Check the claim. See the evidence.</h1>
      <p className="intro">A focused workspace for understanding what public claims are supported by reliable sources.</p>
      <form className="claim-form" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="claim">What would you like to verify?</label>
        <textarea id="claim" value={claim} onChange={(event) => setClaim(event.target.value)} placeholder="Paste a claim or headline..." rows="5" />
        <button type="submit">Start a check</button>
      </form>
    </main>
  )
}

export default App
