import React from "react";

const fallbackLogo = "/softHireLogo.png";

const MessageCard = ({
    chat,
    companyLogo = fallbackLogo,
    companyName = "Company Name",
    senderName = "Sender Name",
    date = "DATE",
    message = "Message preview goes here...",
    onArchive = () => { },
    onSchedule = () => { },
    scheduleLabel = "Unscheduled",
    onClick = () => { },  // <-- New prop to indicate unread messages
}) => {
    return (
        <>
            <div onClick={onClick} className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 gap-4 cursor-pointer hover:shadow-md transition-all duration-200 md:flex-row md:items-start xl:gap-8 xl:p-6">
                <div className="w-full flex gap-3 md:flex-row md:items-start relative">
                    {/* Logo + Badge wrapper */}
                    <div className="flex-shrink-0 flex items-center justify-center md:items-start md:justify-start mb-2 md:mb-0 relative">
                        <img
                            src={companyLogo}
                            alt={chat?.companyName}
                            className="w-10 h-10 rounded object-contain border border-gray-100 bg-gray-50"
                            onError={e => (e.target.src = fallbackLogo)}
                        />
                        {chat?.unreadCount > 0 && (
                            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold leading-none flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                                {chat?.unreadCount > 9 ? "9+" : chat?.unreadCount}
                            </span>
                        )}
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 flex flex-col min-w-0 justify-center">
                        <div className="flex flex-col w-full">
                            <span className="font-semibold text-xl text-gray-900 truncate max-w-full">{chat?.companyName}</span>
                            <div className="flex gap-2 items-center">
                                <span className="font-semibold text-gray-700 text-sm truncate max-w-full">{chat?.recruiterName}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wide whitespace-nowrap">{date}</span>
                            </div>
                        </div>
                        <div className="mt-1 text-gray-600 text-sm break-words max-w-full">
                            {message}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2 md:gap-3 mt-2 md:mt-0 md:ml-auto w-full md:w-auto xl:gap-4">
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 text-base font-semibold border border-gray-200 shadow-sm transition w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-primary-200"
                        onClick={e => {
                            e.stopPropagation();
                            onArchive();
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v1.5M3 8.25h18M3 8.25v9A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25v-9M9 12h6" />
                        </svg>
                        Archive
                    </button>
                    <div className="relative w-full md:w-auto">
                        <button
                            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-base font-semibold hover:bg-gray-50 transition flex items-center gap-2 w-full md:w-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                            onClick={e => {
                                e.stopPropagation();
                                onSchedule();
                            }}
                        >
                            {scheduleLabel}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15l3.75 3.75 3.75-3.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessageCard;
