import Login from './Login'
import Test from './Test'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LogsContextProvider from './contexts/LogsContext'
import AuthContextProvider from './contexts/AuthContext'

function App() {
  return (
    <>
      <BrowserRouter>
        <LogsContextProvider>
          <AuthContextProvider>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/test' element={<Test />} />
            </Routes>
          </AuthContextProvider>
        </LogsContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
