import React, { useState } from 'react';
import { Search, Plus, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { setMessages, setReceiver } from '@/redux/chatSlice';

const MessagesSidebar = () => {
    const { receiver, recentChats } = useSelector((state) => state.chat);
    const [searchValue, setSearchValue] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    const sortedChats = Array.isArray(recentChats)
        ? [...recentChats]
            .sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0))
            .filter((chat) =>
                searchValue.trim() === '' ||
                chat.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                chat.primaryRole.toLowerCase().includes(searchValue.toLowerCase())
            )
        : [];

    return (
        <div className="relative flex h-screen pb-16">
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden fixed top-3 left-0 z-50 p-2"
                aria-label="Toggle sidebar"
            >
                {isSidebarOpen ? <X /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div
                className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-80 bg-white transition-transform duration-300 ease-in-out h-screen`}
            >
                <div className="w-80 h-screen bg-[#F4F3F2] flex flex-col z-0">
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                    </div>

                    {/* Search and Filters */}
                    <div className="p-4 space-y-4">
                        {/* Search Bar */}
                        <div className="relative border border-gray-200 rounded-3xl">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Buttons */}
                        {/* <div className="flex space-x-2">
                            <button
                                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${'active' === 'active'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-[#F3E4E2] border border-red-600 text-gray-700'
                                    }`}
                            >
                                Ongoing
                            </button>
                        </div> */}
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto">
                        {sortedChats.length > 0 ? (
                            sortedChats.map((chat, idx) => (
                                <div
                                    key={chat._id + '-' + idx}
                                    onClick={() => {
                                        dispatch(setReceiver(chat._id));
                                        dispatch(setMessages([]));
                                    }}
                                    className={`p-3 border-l-4 mr-4 ${chat._id === receiver
                                        ? 'border-[#EA4C25] bg-white'
                                        : 'border-transparent'
                                        } hover:bg-gray-50 cursor-pointer transition-colors`}
                                >
                                    <div className="flex gap-2">
                                        <Avatar>
                                            <AvatarImage src={chat.profileImage} />
                                            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm mb-1">
                                                {chat.name}
                                            </div>
                                            <div className="text-xs text-gray-600">{chat.primaryRole}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">No chat found</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default MessagesSidebar;
