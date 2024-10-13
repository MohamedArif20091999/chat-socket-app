import {  Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

function App() {


  return (
    <AuthProvider>
    <Routes>
        {/* Protected Route */}
        <Route path="/chat" element={ <ProtectedRoute><Chat /></ProtectedRoute> } />

        {/* <ProtectedRoute path="/chat"  component={Chat} /> */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Login/>} />
      
    </Routes>
  </AuthProvider>

  )
}

export default App
