import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1 className="blue-text alignCenter-text">App Component</h1>
     <h1 className="green-text alignCenter-text">App Component</h1>
     <h1 className="alignCenter-text">App Component</h1>
     <h1 className="light-text dark-bg alignCenter-text">App Component</h1>
    </>
  )
}

export default App
