import React, { useState } from 'react';
import axios from './api';
import { Box, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
const ChatWindow = ({ conversation, onDeleteConversation }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post(`/conversations/${conversation.id}/messages`, {
        text: message,
        timestamp: new Date().toISOString(),
      });
      conversation.messages.push({ text: message, timestamp: new Date().toISOString(), origin: 'client' });
      conversation.messages.push(response.data); // Add the static response from the backend
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px',height: '800px', display: 'flex', flexDirection: 'column', }}>
      {conversation && (
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px">
          <h2>{conversation.name}</h2>
          <IconButton 
            color="secondary" 
            onClick={() => onDeleteConversation(conversation.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {conversation && conversation.messages.map((msg, index) => (
          <Box key={index} style={{ 
            textAlign: msg.origin === 'client' ? 'right' : 'left', 
            backgroundColor: msg.origin === 'client' ? '#e0f7fa' : '#f1f8e9', 
            padding: '10px', 
            borderRadius: '10px',
            margin: '5px 0'
          }}>
            <p>{msg.text}</p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </Box>
        ))}
      </Box>
      {conversation && (
        <Box display="flex" alignItems="center" style={{ marginTop: '20px' }} component="form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            label="Type a message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
          />
          <Button variant="contained" color="primary" type="submit" style={{ marginLeft: '10px' }}>
            Send
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChatWindow;
