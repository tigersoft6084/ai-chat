import React from "react";
import { List, ListItemButton, ListItemText, Box } from "@mui/material";

const ConversationList = ({ conversations, onSelectConversation }) => {
  return (
    <Box flexGrow={1}>
      <List style={{ overflow: "auto" }}>
        {conversations.map((conversation) => (
          <ListItemButton
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
          >
            <ListItemText primary={conversation.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default ConversationList;
