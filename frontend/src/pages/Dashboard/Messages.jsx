import { getRecentChatsForUser } from '@/Api/ChatServices'
import MessageDrawer from '@/components/Dashboard/MessageDrawer'
import ChatDrawerContent from '@/components/miniComponents/ChatDrawerContent'
import Loader from '@/components/miniComponents/Loader'
import MessageCard from '@/components/miniComponents/messageCard'
import React, { useEffect, useState } from 'react'

function Messages() {
  const [tab, setTab] = useState("Ongoing")
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchChats = async () => {
    try {
      setChatLoading(true);
      const response = await getRecentChatsForUser();
      setChats(response.conversations);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
    } finally {
      setChatLoading(false);
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  const handleOpenChat = (chat) => {
    setSelectedChat(chat);
    setDrawerOpen(true);

    // Notify backend to mark messages as read
    socket.emit("mark_as_read", {
      userId: currentUserId,
      conversationId: chat._id
    });

    // Set unreadCount to 0 in the chats list
    setChats(prevChats => prevChats.map(c =>
      c._id === chat._id ? { ...c, unreadCount: 0 } : c
    ));
  };


  return (
    <>
      <div className="px-[5%] py-[2%]">
        <p className='text-3xl font-bold'>Messages</p>
        <div className="flex my-8 gap-8 text-lg font-medium">
          <p className={` py-2 cursor-pointer ${tab === "Ongoing" ? "text-black-700 border-black border-b-2" : "opacity-50 hover:opacity-100 hover:border-b-2"}`} onClick={() => setTab("Ongoing")}>Ongoing</p>
          <p className={`py-2 cursor-pointer ${tab === "Archived" ? "text-black-700 border-black border-b-2" : "opacity-50 hover:opacity-100 hover:border-b-2"}`} onClick={() => setTab("Archived")}>Archived</p>
        </div>
        <MessageDrawer open={drawerOpen} setOpen={setDrawerOpen}>
          <ChatDrawerContent chat={selectedChat} />
        </MessageDrawer>
        {
          chatLoading ? (
            <p className="flex justify-center items-center"><Loader /></p>
          ) : (
            <div className="flex flex-col gap-4">
              {chats.map((chat) => (
                <MessageCard chat={chat} key={chat._id} onClick={() => {
                  handleOpenChat(chat);
                }} />
              ))}
            </div>
          )
        }
      </div>
    </>
  )
}

export default Messages