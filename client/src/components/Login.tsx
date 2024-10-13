import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    console.log(identifier, password, "login")
      await login(identifier, password);
      console.log("LOGIN TRIED")
    //   const response = await axios.post(`${import.meta.env.VITE_APP_STRAPI_API_URL}/auth/local`, {
    //     identifier,
    //     password,
    //   });
    //   console.log(response.data, "response")
      navigate('/chat');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.log(err)
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username or Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={identifier}
            size='small'
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            size='small'
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Box>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
