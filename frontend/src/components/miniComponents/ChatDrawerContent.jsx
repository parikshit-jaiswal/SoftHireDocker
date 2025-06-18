import React, { useState, useEffect, useRef } from "react";
import { EllipsisVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
    addMessage,
    setMessages,
} from "@/redux/chatSlice";
import { getChatsWithUser } from "@/Api/ChatServices";
import Loader from "./Loader";

const socket = io(import.meta.env.VITE_SERVER_URL, { withCredentials: true }); // ensure your backend supports this

const ChatDrawerContent = ({ chat }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const currentUserId = user._id;
    const receiverId = chat?.recruiterId;

    const [message, setMessage] = useState("");
    const [messageLoading, setMessageLoading] = useState(false);
    const [messages, setMessages] = useState([]);

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
                userId: currentUserId, // grab from auth context or wherever
                conversationId: chat._id
            });
        }
    }, [chat]);


    useEffect(() => {
        socket.emit("register", currentUserId);

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

    if (!receiverId) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="text-gray-500 text-xl text-center">
                    Select a user to start chatting
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="flex items-start gap-3 p-2 pb-4 border-b">
                <img
                    src="/social123-logo.png"
                    alt="Social123 Technologies"
                    className="w-12 h-12 rounded object-contain border bg-gray-50 my-auto"
                />
                <div className="flex-1">
                    <div className="font-semibold text-xl">{chat?.companyName}</div>
                    <div className="text-gray-500 text-sm">{chat?.recruiterName}</div>
                    <div className="text-xs text-gray-400 mt-1">Matched on May 8</div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 text-2xl font-bold px-2 mr-5 mt-1">
                    <EllipsisVertical />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b mt-2">
                <button className="px-4 py-2 border-b-2 border-black font-medium">Messages</button>
                <button className="px-4 py-2 text-gray-500 hover:text-black">Job description</button>
                <button className="px-4 py-2 text-gray-500 hover:text-black">Company info</button>
            </div>

            {/* Messages */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ maxHeight: '600px' }}
            >
                {messageLoading ? (
                    <div className="h-96 flex items-center justify-center">
                        <p><Loader /></p>
                    </div>
                ) : (
                    <>
                        {(Array.isArray(messages) ? messages : []).map((msg, index) => (
                            <div key={index} className="flex flex-col gap-1">
                                <div
                                    className={`max-w-lg p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.sender === currentUserId
                                        ? 'bg-blue-500 text-white self-end ml-auto rounded-br-none'
                                        : 'bg-gray-100 text-gray-900 self-start mr-auto rounded-bl-none'
                                        }`}
                                >
                                    {linkify(msg.content.trim())}
                                </div>
                                <div
                                    className={`text-xs text-gray-500 ${msg.sender === currentUserId ? 'text-right' : 'text-left'
                                        }`}
                                >
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Input */}
            <form
                onSubmit={handleSendMessage}
                className="flex items-end gap-2 p-2 border-t bg-white"
            >
                <textarea
                    className="flex-1 border-2 border-blue-300 rounded-lg p-2 resize-none min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                />
                <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-900"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatDrawerContent;
