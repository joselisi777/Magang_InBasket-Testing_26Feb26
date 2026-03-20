import Login from './Login'
import Test from './Test'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/test' element={<Test />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
