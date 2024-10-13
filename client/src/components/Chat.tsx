import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import io, { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';

interface Message {
  sender: 'user' | 'server';
  message: string;
}

const Chat: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [chat, setChat] = useState<Message[]>(() => {
    const storedChat = localStorage.getItem('chat');
    return storedChat ? JSON.parse(storedChat) : [];
  });
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user) {
      socketRef.current = io(import.meta.env.VITE_APP_WEBSOCKET_URL || 'http://localhost:4000', {
        query: { userId: user.user.id },
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socketRef.current.on('message', (msg: string) => {
        const newMessage: Message = { sender: 'server', message: msg };
        setChat((prev) => {
          const updated = [...prev, newMessage];
          localStorage.setItem('chat', JSON.stringify(updated));
          return updated;
        });
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = () => {
    console.log('Sending message:', message, socketRef.current) ;
    if (socketRef.current && message.trim() !== '') {
      socketRef.current.emit('message', message);
      const newMessage: Message = { sender: 'user', message };
      setChat((prev) => {
        const updated = [...prev, newMessage];
        localStorage.setItem('chat', JSON.stringify(updated));
        return updated;
      });
      setMessage('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login') 
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Container maxWidth="md" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Real-Time Chat
          </Typography>
          <Button color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        mt={2}
        mb={2}
        flexGrow={1}
        p={2}
        boxShadow={3}
        borderRadius={2}
        style={{ overflowY: 'auto', backgroundColor: '#f5f5f5' }}
      >
        <List>
          {chat.map((msg, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemText
                primary={msg.sender === 'user' ? 'You' : 'Server'}
                secondary={msg.message}
                style={{
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                }}
              />
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>
      <Box display="flex" alignItems="center">
        <TextField
          label="Type your message..."
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginLeft: '10px' }}>
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default Chat;
