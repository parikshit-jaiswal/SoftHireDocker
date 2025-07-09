import { getRecentChatsForUser } from '@/Api/ChatServices';
import MessageDrawer from '@/components/Dashboard/MessageDrawer';
import ChatDrawerContent from '@/components/miniComponents/ChatDrawerContent';
import Loader from '@/components/miniComponents/Loader';
import MessageCard from '@/components/miniComponents/messageCard';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '@/sockets/socket';
import { MessageCircle, Archive, Search } from 'lucide-react';

function Messages() {
  const [tab, setTab] = useState("Ongoing");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useSelector(state => state.auth);
  const currentUserId = user?._id;

  const handleToggleArchive = async (chatId) => {
    try {
      await toggleConversationStatus(chatId);
      fetchChats(); // Refresh the chat list after toggling
    } catch (error) {
      console.error('Failed to toggle conversation status:', error);
    }
  };

  const fetchChats = async () => {
    try {
      setChatLoading(true);
      const response = await getRecentChatsForUser();
      setChats(response.conversations || []);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
      setChats([]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Filter chats based on search term and tab
  useEffect(() => {
    let filtered = chats;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(chat => 
        chat?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat?.recruiterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat?.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tab (you can add logic for archived chats here)
    if (tab === "Archived") {
      filtered = filtered.filter(chat => chat?.isArchived === true);
    } else {
      filtered = filtered.filter(chat => chat?.isArchived !== true);
    }

    setFilteredChats(filtered);
  }, [chats, searchTerm, tab]);

  const handleOpenChat = (chat) => {
    setSelectedChat(chat);
    setDrawerOpen(true);
    
    if (socket && currentUserId && chat?._id) {
      socket.emit("mark_as_read", {
        userId: currentUserId,
        conversationId: chat._id
      });
    }
    
    setChats(prevChats => prevChats.map(c =>
      c._id === chat._id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleCloseChat = () => {
    setDrawerOpen(false);
    setSelectedChat(null);
  };

  const ongoingCount = chats.filter(chat => chat?.isArchived !== true).length;
  const archivedCount = chats.filter(chat => chat?.isArchived === true).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 md:px-[5%] py-4 md:py-[2%]">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Stay connected with recruiters and companies
            </p>
          </div>
          
          {/* Message Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MessageCircle size={16} />
              <span>{chats.length} total</span>
            </div>
            {chats.filter(chat => chat?.unreadCount > 0).length > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{chats.filter(chat => chat?.unreadCount > 0).length} unread</span>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar - Responsive */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            />
          </div>
        </div>

        {/* Tabs - Responsive */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button 
            className={`py-3 px-1 cursor-pointer font-medium text-sm md:text-lg whitespace-nowrap transition-colors ${
              tab === "Ongoing" 
                ? "text-blue-600 border-blue-600 border-b-2" 
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b-2"
            }`} 
            onClick={() => setTab("Ongoing")}
          >
            Ongoing
            {ongoingCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {ongoingCount}
              </span>
            )}
          </button>
          <button 
            className={`py-3 px-1 ml-6 md:ml-8 cursor-pointer font-medium text-sm md:text-lg whitespace-nowrap transition-colors ${
              tab === "Archived" 
                ? "text-blue-600 border-blue-600 border-b-2" 
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b-2"
            }`} 
            onClick={() => setTab("Archived")}
          >
            Archived
            {archivedCount > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                {archivedCount}
              </span>
            )}
          </button>
        </div>

        {/* Chat Drawer with Smooth Transitions */}
        <MessageDrawer open={drawerOpen} setOpen={setDrawerOpen}>
          <ChatDrawerContent chat={selectedChat} onClose={handleCloseChat} />
        </MessageDrawer>

        {/* Chat List - Responsive */}
        {chatLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <MessageCard 
                  chat={chat} 
                  key={chat._id} 
                  onClick={() => handleOpenChat(chat)} 
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                  {searchTerm ? (
                    <>
                      <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No conversations found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your search term or check a different tab
                      </p>
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear search
                      </button>
                    </>
                  ) : tab === "Ongoing" ? (
                    <>
                      <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No ongoing conversations
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Start applying to jobs to connect with recruiters and begin conversations
                      </p>
                      <button 
                        onClick={() => window.location.href = '/dashboard/jobs'}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Browse Jobs
                      </button>
                    </>
                  ) : (
                    <>
                      <Archive className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No archived conversations
                      </h3>
                      <p className="text-gray-500">
                        Conversations you archive will appear here
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;