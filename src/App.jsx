import Login from './Login'
import Test from './Test'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LogsContextProvider from './contexts/LogsContext'
import AuthContextProvider from './contexts/AuthContext'
import ProtectedRoutes from './utils/ProtectedRoutes'
import PublicRoutes from './utils/PublicRoutes'

function App() {
  return (
    <>
      <BrowserRouter>
        <LogsContextProvider>
          <AuthContextProvider>
            <Routes>
              <Route element={<PublicRoutes />}>
                <Route path='/' element={<Login />} />
              </Route>
              <Route element={<ProtectedRoutes />}>
                <Route path='/test' element={<Test />} />
              </Route>
            </Routes>
          </AuthContextProvider>
        </LogsContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
