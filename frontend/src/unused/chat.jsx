import { useEffect, useState } from 'react';
import socket from '@/sockets/socket';


function Chat({ userId, receiverId }) {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    useEffect(() => {
        socket.emit("register", userId);

        socket.on("new_message", (msg) => {
            setChat(prev => [...prev, msg]);
        });

        return () => {
            socket.off("new_message");
        };
    }, [userId]);

    const sendMessage = () => {
        socket.emit("private_message", {
            senderId: userId,
            receiverId,
            content: message
        });
        setMessage("");
    };

    return (
        <div>
            <div>
                {chat.map((msg, idx) => (
                    <p key={idx}><strong>{msg.sender === userId ? "Me" : "Them"}:</strong> {msg.content}</p>
                ))}
            </div>
            <input value={message} onChange={e => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chat;


// import { getApplicantProfile } from '@/Api/ApplicantServices';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// function ApplicantsProfile() {
//     const { id } = useParams();
//     const [data, setData] = useState(null);

//     useEffect(() => {
//         const profile = async () => {
//             const data = await getApplicantProfile(id);
//             setData(data);
//         };
//         profile();
//     }, [id]);

//     return (
//         <>
//             <div className="px-[10%] py-[5%]">
//                 <div className="border-black border rounded-lg p-4">
//                     <div className="flex">
//                         <Avatar className="w-20 h-20 mb-4">
//                             <AvatarImage src="https://github.com/shadcn.png" />
//                             <AvatarFallback>CN</AvatarFallback>
//                         </Avatar>
//                         <div className="">
//                             <div className="flex gap-2 justify-center items-center">
//                                 <p className='text-3xl font-bold'>Priya Sharma</p>
//                                 <p className='bg-[#D6E1E7] rounded-3xl h-fit p-1 px-2 border border-black text-xs'>Active Today</p>
//                             </div>
//                             <div className=""></div>
//                         </div>
//                     </div>
//                 </div>
//             </div >
//         </>
//     );
// }

// export default ApplicantsProfile;
