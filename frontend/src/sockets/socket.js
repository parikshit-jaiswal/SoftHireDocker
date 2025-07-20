import { io } from "socket.io-client";

// Get the server URL from environment or use default
const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
console.log('Socket connecting to:', serverUrl);

const socket = io(serverUrl, {
    withCredentials: true,
    autoConnect: false,
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: false, // Changed from true to false
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 5,
    // Add path specification to ensure correct endpoint
    path: '/socket.io/'
});

// Add comprehensive error handling
socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
    console.error('Error type:', error.type);
    console.error('Error description:', error.description);
    console.error('Full error details:', error);
    
    // Specific handling for namespace errors
    if (error.message.includes('Invalid namespace')) {
        console.error('❌ Invalid namespace error - check server configuration');
    }
});

socket.on('connect', () => {
    console.log('✅ Socket connected successfully:', socket.id);
    console.log('Connected to:', serverUrl);
});

socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
        // Server initiated disconnect, reconnect manually
        socket.connect();
    }
});

socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
    console.error('❌ Socket reconnection error:', error);
});

socket.on('reconnect_failed', () => {
    console.error('❌ Socket reconnection failed after maximum attempts');
});

export default socket;
