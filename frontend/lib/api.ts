const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
  // Upload PDF
  uploadPDF: async (chatbotId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/upload/${chatbotId}`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  },

  // Send chat message
  sendMessage: async (
    chatbotId: string,
    message: string,
    history: any[],
    systemInstructions: string,
    sessionId: string | null
  ) => {
    const res = await fetch(`${API_URL}/api/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatbot_id: chatbotId,
        message,
        history,
        system_instructions: systemInstructions,
        session_id: sessionId,
      }),
    });
    return res.json();
  },
// Update chatbot
updateChatbot: async (
  chatbotId: string,
  data: { name?: string; description?: string; instructions?: string; color?: string }
) => {
  const res = await fetch(`${API_URL}/api/chatbot/${chatbotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
},
// Get documents for a chatbot
getDocuments: async (chatbotId: string) => {
  const res = await fetch(`${API_URL}/api/upload/${chatbotId}`);
  return res.json();
},

// Delete a document
deleteDocument: async (documentId: string) => {
  const res = await fetch(`${API_URL}/api/upload/${documentId}/delete`, {
    method: "DELETE",
  });
  return res.json();
},

// Get all sessions for a chatbot
getSessions: async (chatbotId: string) => {
  const res = await fetch(`${API_URL}/api/chat/sessions/${chatbotId}`);
  return res.json();
},

// Get messages for a session
getSessionMessages: async (sessionId: string) => {
  const res = await fetch(`${API_URL}/api/chat/history/${sessionId}`);
  return res.json();
},

// Delete a session
deleteSession: async (sessionId: string) => {
  const res = await fetch(`${API_URL}/api/chat/sessions/${sessionId}`, {
    method: "DELETE",
  });
  return res.json();
},
  // Create chatbot
  createChatbot: async (data: {
    user_id: string;
    name: string;
    description: string;
    instructions: string;
    color: string;
  }) => {
    const res = await fetch(`${API_URL}/api/chatbot/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Get user chatbots
  getChatbots: async (userId: string) => {
    const res = await fetch(`${API_URL}/api/chatbot/user/${userId}`);
    return res.json();
  },

  // Get single chatbot
  getChatbot: async (chatbotId: string) => {
    const res = await fetch(`${API_URL}/api/chatbot/${chatbotId}`);
    return res.json();
  },

  // Delete chatbot
  deleteChatbot: async (chatbotId: string) => {
    const res = await fetch(`${API_URL}/api/chatbot/${chatbotId}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // Rate a message
rateMessage: async (messageId: string, rating: string) => {
  const res = await fetch(`${API_URL}/api/chat/rate/${messageId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating }),
  });
  return res.json();
},
};