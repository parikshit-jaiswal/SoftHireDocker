import API from "./api";


export const getRecentChats = async () => {
    try {
        const response = await API.get(`/chat/recruiter/recentChats`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Get Recent Chats Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getRecentChatsForUser = async () => {
    try {
        const response = await API.get(`/chat/user/recentChats`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Get Recent Chats Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getChatsWithUser = async (receiverId) => {
    try {
        const response = await API.get(`/chat/recruiter/${receiverId}`, {
            withCredentials: true
        });
        // console.log("Get Chats With User Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Get Chats With User Error:", error.response?.data || error.message);
        throw error;
    }
};


