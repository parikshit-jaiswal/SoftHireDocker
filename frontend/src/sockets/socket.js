import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
    withCredentials: true,
    autoConnect: false,
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

// Add error handling
socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
    console.error('Error details:', error);
});

socket.on('connect', () => {
    console.log('Socket connected successfully:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
});

export default socket;
