const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
const FILE_PATH = './conversations.json';

const readConversations = () => {
  if (!fs.existsSync(FILE_PATH)) {
    return [];
  }
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
};

// Helper function to write conversations to file
const writeConversations = (conversations) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(conversations, null, 2));
};

app.get('/api/conversations', (req, res) => {
  const conversations = readConversations();
  res.json(conversations);
});

app.post('/api/conversations', (req, res) => {
  const conversations = readConversations();
  const newConversation = {
    id: conversations.length + 1,
    ...req.body,
    messages: []
  }
  console.log(newConversation)
  conversations.push(newConversation);
  writeConversations(conversations);
  res.status(201).json(newConversation);
});

app.post('/api/conversations/:id/messages', (req, res) => {
  const conversations = readConversations();
  const conversation = conversations.find(conv => conv.id == req.params.id);

  const { text, timestamp } = req.body;
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  conversation.messages.push({text, timestamp, origin: 'client'});
  const responseMessage = { text: "How can I assist you today?", timestamp: new Date().toISOString(), origin: 'server' };
  conversation.messages.push(responseMessage);
  writeConversations(conversations);
  res.status(201).json(responseMessage);
});

app.delete('/api/conversations/:id', (req, res) => {
  const conversations = readConversations();
  console.log(req.params.id, conversations)
  const updatedConversations = conversations.filter(conv => conv.id != req.params.id);
  writeConversations(updatedConversations);
  res.status(204).send();
});

app.delete('/api/conversations', (req, res) => {
  writeConversations([]);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
