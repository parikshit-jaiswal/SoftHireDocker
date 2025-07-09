import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, MoreVertical } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addMessage, addRecentChats, setMessages,
    setNewChat, setReceiver, setRecentChats, setSender
} from '@/redux/chatSlice';
import { getChatsWithUser, getRecentChats } from '@/Api/ChatServices';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Loader from '@/components/miniComponents/Loader';
import socket from '@/sockets/socket';

function MessageBox() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { sender, receiver, messages, recentChats, newChat } = useSelector((state) => state.chat);

    const [message, setMessage] = useState('');
    const [messageLoading, setMessageLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const currentUserId = user?._id;
    const receiverId = receiver;
    const selectedUser = (Array.isArray(recentChats) ? recentChats : [])?.find(chat => chat._id === receiverId) || {};

    const linkify = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) => {
            if (urlRegex.test(part)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        {part}
                    </a>
                );
            } else {
                return part;
            }
        });
    };

    // Initial setup
    useEffect(() => {
        dispatch(setNewChat(null));
    }, [dispatch]);

    // Fetch recent chats
    const fetchRecentChats = async () => {
        try {
            const recentChats = await getRecentChats();
            dispatch(setRecentChats(recentChats));
            if (newChat) {
                dispatch(addRecentChats(newChat));
                dispatch(setReceiver(newChat._id));
            }
        } catch (error) {
            console.error("Failed to fetch recent chats:", error);
        }
    };

    // Fetch messages with selected user
    const fetchChatsWithUser = async (receiverId) => {
        try {
            setMessageLoading(true);
            const chats = await getChatsWithUser(receiverId);
            dispatch(setMessages(chats.messages || []));
        } catch (error) {
            console.error("Failed to fetch chats with user:", error);
        } finally {
            setMessageLoading(false);
        }
    };

    // Set sender and register socket
    useEffect(() => {
        if (user?._id) {
            dispatch(setSender(user._id));
            if (!socket.connected) {
                socket.connect();
            }
            socket.emit("register", user._id);
            console.log("Socket registered:", user._id);
        }
    }, [user?._id]);

    // Socket connection/debug logging
    useEffect(() => {

        console.log("Socket status:", socket.connected);
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        return () => {
            socket.off("connect");
            socket.off("connect_error");
        };
    }, []);

    // Listen to new messages
    useEffect(() => {
        socket.on("new_message", (msg) => {
            console.log("New message received:", msg);
            dispatch(addMessage(msg));
        });

        return () => {
            socket.off("new_message");
        };
    }, [dispatch]);

    // Fetch chats when receiver changes
    useEffect(() => {
        if (receiverId) {
            fetchChatsWithUser(receiverId);
        }
    }, [receiverId]);

    // Fetch recent chats on mount
    useEffect(() => {
        dispatch(setRecentChats([]));
        fetchRecentChats();
    }, []);

    // Scroll to bottom on message change
    useEffect(() => {
        if (!messageLoading) {
            messagesContainerRef.current?.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'auto'
            });
        }
    }, [messages, messageLoading]);

    const handleSendMessage = () => {
        if (message.trim() && currentUserId && receiverId) {
            const msgPayload = {
                sender: currentUserId,
                receiver: receiverId,
                content: message.trim(),
                createdAt: new Date().toISOString(),
            };
            socket.emit("private_message", msgPayload);
            dispatch(addMessage(msgPayload));
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!selectedUser || !selectedUser._id) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="text-gray-500 text-xl justify-center">Select a user to start chatting</p>
            </div>
        );
    }

    return (
        <div className="py-2 w-full m-5 mb-20 shadow-sm">
            <div className="w-full h-full flex flex-col bg-white border border-gray-300 shadow rounded-lg">
                {/* Header */}
                <div className="flex items-center gap-3 p-2 px-4 border border-b-gray-200 shadow-sm justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-14 w-14">
                            <AvatarImage src={selectedUser.profileImage} />
                            <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2 className="font-semibold text-gray-900">{selectedUser.name}</h2>
                            <p className="text-sm text-gray-500">{selectedUser.primaryRole}</p>
                        </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div
                    ref={messagesContainerRef}
                    className="p-4 space-y-4 overflow-y-auto overflow-x-hidden flex-1"
                    style={{ maxHeight: '600px' }}
                >
                    {messageLoading ? (
                        <div className="h-96 flex items-center justify-center"><Loader /></div>
                    ) : (
                        <>
                            {(Array.isArray(messages) ? messages : []).map((msg, index) => (
                                <div key={index} className="flex flex-col gap-1">
                                    <div
                                        className={`whitespace-pre-wrap max-w-lg md:max-w-xl p-3 rounded-lg text-sm ${msg.sender === currentUserId
                                            ? 'bg-blue-500 text-white self-end ml-auto rounded-br-none'
                                            : 'bg-gray-100 text-gray-900 self-start mr-auto rounded-bl-none'
                                            }`}
                                    >
                                        {linkify(msg.content.trim())}
                                    </div>
                                    <div className={`text-xs text-gray-500 ${msg.sender === currentUserId ? 'text-right' : 'text-left'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input */}
                <div className="border-t p-4">
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Paperclip size={20} />
                        </button>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type a message here..."
                            className="flex-1 p-2 border rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button onClick={handleSendMessage} className="p-2 text-gray-400 hover:text-gray-600">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageBox;
