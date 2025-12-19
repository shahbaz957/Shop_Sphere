import './App.css'
import { AuthProvider } from './context/authContext'
import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './pages/ProtectedRoute';
import { SearchProvider } from './context/searchContext';
function App() {
  

  return (
    <AuthProvider>
      <SearchProvider>
      <BrowserRouter>
       <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
       </Routes>
      </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  )
}

export default App
