import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import io, { Socket } from 'socket.io-client';
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
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Message {
  sender: 'user' | 'server';
  message: string;
  sessionId?: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
}

const Chat: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [newSessionName, setNewSessionName] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null); // Initialize ref

  useEffect(() => {
    if (user) {
      // Initialize socket only once
      socketRef.current = io(import.meta.env.VITE_APP_WEBSOCKET_URL || 'http://localhost:4000', {
        query: { userId: user.user.id },
      });

      // Listen for socket events
      socketRef.current.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      socketRef.current.on('message', (data: Message) => {
        console.log('Received message from server:', data);
        if (data.sessionId === currentSessionId) {
          setSessions((prevSessions) =>
            prevSessions.map((session) =>
              session.id === data.sessionId
                ? { ...session, messages: [...session.messages, data] }
                : session
            )
          );
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      // Cleanup on unmount
      return () => {
        socketRef.current?.disconnect();
        socketRef.current = null;
      };
    }
  }, [user, currentSessionId]); // Depend on user and currentSessionId

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, currentSessionId]);

  const handleSessionChange = (event: SelectChangeEvent<string>) => {
    setCurrentSessionId(event.target.value as string);
  };

  const handleCreateSession = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewSessionName('');
  };

  const handleCreateNewSession = () => {
    if (newSessionName.trim() === '') return;

    const newSession: ChatSession = {
      id: newSessionName,
      messages: [],
    };

    setSessions((prevSessions) => [...prevSessions, newSession]);
    setCurrentSessionId(newSessionName); // Automatically switch to the new session
    handleDialogClose();
  };

  const currentSession = sessions.find((session) => session.id === currentSessionId) || { messages: [] };

  const handleSendMessage = () => {
    if (!message.trim() || !currentSessionId || !socketRef.current) return;

    const newMessage: Message = {
      sender: 'user',
      message,
      sessionId: currentSessionId, // Include sessionId
    };

    // Update current session's messages
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, newMessage],
          };
        }
        return session;
      })
    );

    console.log(currentSessionId, newMessage, "currentSessionId, newMessage");
    // Emit message to server via socket
    socketRef.current.emit('message', newMessage); // Send message with sessionId

    // Clear input field
    setMessage('');
  };

  console.log(currentSession)

  return (
    <>
   
              <Button sx={{ my:2 }} color="primary" variant='contained' onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </Button>
           <Container maxWidth={false} style={{ height: '100vh', display: 'flex', flexDirection: 'column',  width: '100%',
            padding: 0,
            }}>
               
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Real-Time Chat
          </Typography>
        
          <Button color="inherit" onClick={handleCreateSession}>
            New Session
          </Button>
        </Toolbar>
      </AppBar>

      <Select value={currentSessionId || ''} onChange={handleSessionChange} style={{ margin: '10px 0' }}>
        {sessions.length === 0 ? (
          <MenuItem disabled value="">
            No sessions available
          </MenuItem>
        ) : (
          sessions.map((session) => (
            <MenuItem key={session.id} value={session.id}>
              {session.id}
            </MenuItem>
          ))
        )}
      </Select>

      {/* Show prompt to create a new session if none is selected */}
      {!currentSessionId ? (
        <Box mt={2}>
          <Typography variant="h6" color="textSecondary">
            Please select a session or create a new one to start chatting.
          </Typography>
        </Box>
      ) : (
        <>
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
              {currentSession.messages.map((msg, index) => (
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              style={{ marginLeft: '10px' }}
            >
              Send
            </Button>
          </Box>
        </>
      )}

      {/* Dialog for creating a new session */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Create New Session</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Session Name"
            type="text"
            fullWidth
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateNewSession} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
};

export default Chat;
