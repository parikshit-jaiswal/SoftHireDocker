import React, { useState, useEffect, useRef } from "react";
import { Building, User, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    addMessage,
    setMessages,
} from "@/redux/chatSlice";
import { getChatsWithUser } from "@/Api/ChatServices";
import Loader from "./Loader";
import socket from "@/sockets/socket";

const ChatDrawerContent = ({ chat, onClose }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const currentUserId = user?._id;
    const receiverId = chat?.recruiterId;

    const [message, setMessage] = useState("");
    const [messageLoading, setMessageLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState("messages");

    const addMessage = (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
    };

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
                        className="text-blue-500 hover:underline break-all"
                    >
                        {part}
                    </a>
                );
            } else {
                return part;
            }
        });
    };

    const messagesContainerRef = useRef(null);

    const fetchChatsWithUser = async (receiverId) => {
        try {
            setMessageLoading(true);
            const chats = await getChatsWithUser(receiverId);
            setMessages(chats.messages || []);
        } catch (error) {
            console.error("Failed to fetch chats with user:", error);
        } finally {
            setMessageLoading(false);
        }
    };

    // Fetch chats when receiver changes
    useEffect(() => {
        if (receiverId) {
            fetchChatsWithUser(receiverId);
        }
    }, [dispatch, receiverId]);

    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (chat?._id) {
            socket.emit("mark_as_read", {
                userId: currentUserId,
                conversationId: chat._id
            });
        }
    }, [chat, currentUserId]);

    useEffect(() => {
        if (currentUserId) {
            if (!socket.connected) {
                socket.connect();
            }
            socket.emit("register", currentUserId);
        }

        socket.on("new_message", (msg) => {
            dispatch(addMessage(msg));

            // Only show notification if the message is from the other user and the window is not focused
            if (
                "Notification" in window &&
                Notification.permission === "granted" &&
                msg.sender === receiverId &&
                document.visibilityState !== "visible"
            ) {
                new Notification(`New message from ${chat?.recruiterName || "Recruiter"}`, {
                    body: msg.content,
                    icon: chat?.recruiterProfileImage || '/default-avatar.png',
                });
            }
        });

        return () => {
            socket.off("new_message");
        };
    }, [dispatch, currentUserId, receiverId, chat]);

    // Auto-scroll on new messages
    useEffect(() => {
        if (!messageLoading) {
            messagesContainerRef.current?.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'auto',
            });
        }
    }, [messages, messageLoading]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const msgPayload = {
                sender: currentUserId,
                receiver: receiverId,
                content: message.trim(),
                createdAt: new Date().toISOString(),
            };
            socket.emit("private_message", msgPayload);
            addMessage(msgPayload);
            setMessage("");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        } else {
            return date.toLocaleDateString();
        }
    };

    if (!receiverId || !currentUserId) {
        return (
            <div className="flex items-center justify-center h-full w-full p-4">
                <div className="text-center">
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">
                        Select a conversation to start chatting
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-white">
            {/* Header - Responsive (Removed Options Menu) */}
            <div className="flex items-center gap-3 p-3 md:p-4 border-b bg-white">
                {/* Mobile Back Button */}
                <button 
                    onClick={onClose}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                {/* Company/Recruiter Avatar */}
                <div className="relative flex-shrink-0">
                    {chat?.recruiterProfileImage ? (
                        <img
                            src={chat.recruiterProfileImage}
                            alt={chat?.companyName || chat?.recruiterName}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base ${chat?.recruiterProfileImage ? 'hidden' : 'flex'}`}>
                        {chat?.companyName?.charAt(0) || chat?.recruiterName?.charAt(0) || '?'}
                    </div>
                </div>

                {/* Chat Info - Now takes full available space */}
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm md:text-lg text-gray-900 truncate">
                        {chat?.companyName || 'Unknown Company'}
                    </div>
                    <div className="text-gray-500 text-xs md:text-sm truncate">
                        {chat?.recruiterName || 'Unknown Recruiter'}
                    </div>
                    {chat?.jobTitle && (
                        <div className="text-xs text-gray-400 truncate">
                            {chat.jobTitle}
                        </div>
                    )}
                    {chat?.createdAt && (
                        <div className="text-xs text-gray-400">
                            Connected {formatDate(chat.createdAt)}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs - Responsive */}
            <div className="flex border-b bg-white overflow-x-auto">
                <button 
                    className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === 'messages' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('messages')}
                >
                    Messages
                </button>
                {chat?.jobDescription && (
                    <button 
                        className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                            activeTab === 'job' 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('job')}
                    >
                        Job Details
                    </button>
                )}
                {(chat?.companyInfo || chat?.companyDescription) && (
                    <button 
                        className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                            activeTab === 'company' 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('company')}
                    >
                        Company Info
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
                {activeTab === 'messages' ? (
                    <>
                        {/* Messages - Responsive */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50 scroll-smooth"
                        >
                            {messageLoading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader />
                                </div>
                            ) : (
                                <>
                                    {(Array.isArray(messages) ? messages : []).map((msg, index) => (
                                        <div key={index} className="flex flex-col gap-1">
                                            <div
                                                className={`max-w-[85%] md:max-w-lg p-2 md:p-3 rounded-lg text-sm whitespace-pre-wrap break-words transition-all duration-200 ${
                                                    msg.sender === currentUserId
                                                        ? 'bg-blue-500 text-white self-end ml-auto rounded-br-none hover:bg-blue-600'
                                                        : 'bg-white text-gray-900 self-start mr-auto rounded-bl-none shadow-sm border hover:shadow-md'
                                                }`}
                                            >
                                                {linkify(msg.content.trim())}
                                            </div>
                                            <div
                                                className={`text-xs text-gray-500 px-1 ${
                                                    msg.sender === currentUserId ? 'text-right' : 'text-left'
                                                }`}
                                            >
                                                {formatDate(msg.createdAt)}
                                            </div>
                                        </div>
                                    ))}
                                    {messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <div className="bg-white rounded-full p-4 mb-4 shadow-sm">
                                                <Building className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 text-sm md:text-base">
                                                Start a conversation with {chat?.recruiterName || 'the recruiter'}
                                            </p>
                                            <p className="text-gray-400 text-xs md:text-sm mt-1">
                                                Send a message to get started
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Input - Responsive */}
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-end gap-2 p-3 md:p-4 border-t bg-white"
                        >
                            <textarea
                                className="flex-1 border border-gray-300 rounded-lg p-2 md:p-3 resize-none min-h-[40px] md:min-h-[48px] max-h-32 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                rows={1}
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="bg-blue-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : activeTab === 'job' ? (
                    <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50">
                        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border">
                            <h3 className="font-semibold text-lg mb-4 text-gray-900">Job Information</h3>
                            {chat?.jobTitle && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-1">Position</h4>
                                    <p className="text-gray-900">{chat.jobTitle}</p>
                                </div>
                            )}
                            {chat?.jobDescription && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{chat.jobDescription}</p>
                                </div>
                            )}
                            {chat?.jobLocation && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-1">Location</h4>
                                    <p className="text-gray-900">{chat.jobLocation}</p>
                                </div>
                            )}
                            {chat?.jobSalary && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-1">Salary</h4>
                                    <p className="text-gray-900">{chat.jobSalary}</p>
                                </div>
                            )}
                            {!chat?.jobTitle && !chat?.jobDescription && !chat?.jobLocation && !chat?.jobSalary && (
                                <p className="text-gray-500 text-center py-8">No job information available</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50">
                        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border">
                            <h3 className="font-semibold text-lg mb-4 text-gray-900">Company Information</h3>
                            {chat?.companyName && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-1">Company</h4>
                                    <p className="text-gray-900">{chat.companyName}</p>
                                </div>
                            )}
                            {chat?.companyDescription && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-1">About</h4>
                                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{chat.companyDescription}</p>
                                </div>
                            )}
                            {chat?.companyWebsite && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-1">Website</h4>
                                    <a 
                                        href={chat.companyWebsite} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 hover:underline transition-colors"
                                    >
                                        {chat.companyWebsite}
                                    </a>
                                </div>
                            )}
                            {chat?.companySize && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-1">Company Size</h4>
                                    <p className="text-gray-900">{chat.companySize}</p>
                                </div>
                            )}
                            {!chat?.companyName && !chat?.companyDescription && !chat?.companyWebsite && !chat?.companySize && (
                                <p className="text-gray-500 text-center py-8">No company information available</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatDrawerContent;
