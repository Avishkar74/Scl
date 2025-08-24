import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './app/(front)/page'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-50">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App