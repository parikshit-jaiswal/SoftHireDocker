import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        sender: null,
        receiver: null,
        messages: [],
        recentChats: [],
        newChat: null,
    },
    reducers: {
        setSender: (state, action) => {
            state.sender = action.payload;
        },
        setReceiver: (state, action) => {
            state.receiver = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        clearChat: (state) => {
            state.sender = null;
            state.receiver = null;
            state.messages = [];
        },
        setRecentChats: (state, action) => {
            state.recentChats = action.payload;
        },
        addRecentChats: (state, action) => {
            const existingChat = state.recentChats.find(chat => chat._id === action.payload._id);
            if (!existingChat) {
                state.recentChats.push(action.payload);
            }
        },
        removeRecentChat: (state, action) => {
            state.recentChats = state.recentChats.filter(chat => chat._id !== action.payload);
        },
        setNewChat: (state, action) => {
            state.newChat = action.payload;
        },
    }
});
export const {
    setSender,
    setReceiver,
    setMessages,
    clearChat,
    addMessage,
    setRecentChats,
    addRecentChats,
    removeRecentChat,
    setNewChat
} = chatSlice.actions;
export default chatSlice.reducer;