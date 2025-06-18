import React, { useEffect } from 'react';
import MessageBox from '@/components/Recruiter/Messages/MessageBox';
import MessagesSidebar from '@/components/Recruiter/Messages/MessagesSidebar';

function RecruiterChatPage() {
    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Disable page scroll
        return () => {
            document.body.style.overflow = 'auto'; // Restore on unmount
        };
    }, []);

    return (
        <div className="flex h-screen w-screen">
            <MessagesSidebar />
            <MessageBox/>
        </div>
    );
}

export default RecruiterChatPage;
