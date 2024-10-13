import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

function App() {

  return (
    <AuthProvider>
    <Router>
        <ProtectedRoute path="/chat"  component={Chat} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Login/>} />
      
    </Router>
  </AuthProvider>

  )
}

export default App
