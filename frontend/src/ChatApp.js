import React, { useState, useEffect } from 'react';
import axios from './api';
import { Container, Grid, Paper, Box, Button } from '@mui/material';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

const ChatApp = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    axios.get('/conversations')
      .then(response => setConversations(response.data))
      .catch(error => console.error('Error fetching conversations:', error));
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleClearAll = () => {
    axios.delete('/conversations')
      .then(() => setConversations([]))
      .catch(error => console.error('Error clearing conversations:', error));
  };

  const handleDeleteConversation = (id) => {
    axios.delete(`/conversations/${id}`)
      .then(() => {
        setConversations(conversations.filter(conv => conv.id !== id));
        setSelectedConversation(null);
      })
      .catch(error => console.error('Error deleting conversation:', error));
  };

  const handleAddConversation = () => {
    const newConversationName = `Conversation ${conversations.length + 1}`;
    axios.post('/conversations', { name: newConversationName })
      .then(response => setConversations([...conversations, response.data]))
      .catch(error => console.error('Error adding conversation:', error));
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box padding="10px" display="flex" justifyContent="space-between">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddConversation}
              >
                Add Chat
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </Box>
            <ConversationList 
              conversations={conversations} 
              onSelectConversation={handleSelectConversation} 
            />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper elevation={3}>
            <ChatWindow 
              conversation={selectedConversation} 
              onDeleteConversation={handleDeleteConversation} 
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatApp;
