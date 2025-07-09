import React, { use, useEffect, useState } from 'react';
import { Bell, Users, MessageCircle, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getStats } from '@/Api/RecruiterServices';

function ActionCard({ title, description, buttonText, onButtonClick }) {
  return (
    <div className="bg-white rounded-lg border-gray-400 border p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={onButtonClick}
        className="bg-[#EA4C25] hover:bg-[#ea4c25cf] text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        {buttonText}
      </button>
    </div>
  );
}

function StatsCard({ title, timeFrame, stats }) {
  return (
    <div className="bg-white rounded-lg border-gray-400 border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {timeFrame}
        </div>
      </div>
      <div className="flex justify-between items-center text-center">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationComponent({ notification }) {
  const IconComponent = notification.icon;

  return (
    <div
      className="bg-white rounded-lg border px-4 py-4 border-gray-400 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${notification.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
          <IconComponent className={`w-5 h-5 ${notification.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-gray-800 text-base font-medium leading-relaxed">
              {notification.title}
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {notification.time}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RecruiterHome() {

  const user = useSelector((state) => state.auth.user);

  const [stats, setStats] = useState();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const applicantStats = {
    title: "Applicants",
    timeFrame: "14 Days",
    stats: [
      { value: 15, label: "Applicants" },
      { value: 9, label: "Matches" },
      { value: 18, label: "Messages" }
    ]
  };

  const sourcingStats = {
    title: "Sourcing",
    timeFrame: "14 Days",
    stats: [
      { value: 54, label: "Views" },
      { value: 20, label: "Pitches" },
      { value: 16, label: "Matches" }
    ]
  };

  const discoverTalent = {
    title: "Discover Top Talent for Your Organization",
    description: "Leverage advanced filters to connect with the best candidates. Easily sort through profiles to find the right match for your company's hiring needs.",
    buttonText: "Discover Talent",
    onButtonClick: () => console.log("Discover Talent clicked")
  };

  const collaborate = {
    title: "Collaborate Seamlessly with Your Hiring Team",
    description: "Share candidate profiles, add notes, and keep your team aligned. Enhance the hiring process with unified team collaboration tools.",
    buttonText: "Invite Team Members",
    onButtonClick: () => console.log("Invite Team Members clicked")
  };

  const notifications = [
    {
      id: 1,
      icon: Bell,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: 'You posted a job for Frontend Developer.',
      time: '2 hours ago'
    },
    {
      id: 2,
      icon: Users,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      title: '3 candidates matched for UI/UX Designer role.',
      time: '5 hours ago'
    },
    {
      id: 3,
      icon: MessageCircle,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-100',
      title: 'You received a message from John Doe.',
      time: 'Yesterday'
    }
  ];


  return (
    <div className="min-h-screen p-6 px-[7%] w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Welcome, {user?.fullName?.split(" ")[0]}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsCard {...applicantStats} />
        <StatsCard {...sourcingStats} />
      </div>

      <div className="space-y-6">
        <ActionCard {...discoverTalent} />
        <ActionCard {...collaborate} />
      </div>

      <div className="mt-10">
        <p className="text-2xl font-bold text-gray-900">Activity Feed</p>
        <p className="text-sm text-gray-700">Here's a reminder of what you and your team have been up to recently</p>

        <div className="space-y-4 mt-4">
          {notifications.map((notification) => (
            <NotificationComponent key={notification.id} notification={notification} />
          ))}
        </div>

        <div className="mt-4">
          <button className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 hover:underline transition-colors">
            <span>View More</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}