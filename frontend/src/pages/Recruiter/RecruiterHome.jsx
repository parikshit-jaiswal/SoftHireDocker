import React, { useEffect, useState } from 'react';
import { Users, Search, Plus, TrendingUp, Star, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getRecruiterProfile, getStats } from '@/Api/RecruiterServices';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, buttonText, onClick, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm">{description}</p>
      <button
        onClick={onClick}
        className="w-full bg-[#EA4C25] hover:bg-[#d63e1e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}

function TipCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function RecruiterHome() {
  const user = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState({ applicants: 0, matches: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Keep default values if API fails
      }
    };

    fetchStats();
  }, []);

  // Static tips for recruiters
  const recruitingTips = [
    {
      icon: Star,
      title: "Write Clear Job Descriptions",
      description: "Include specific requirements and company culture to attract the right candidates."
    },
    {
      icon: CheckCircle,
      title: "Respond Quickly",
      description: "Fast response times improve candidate experience and increase acceptance rates."
    },
    {
      icon: Search,
      title: "Use Relevant Keywords",
      description: "Optimize job postings with industry-specific terms to improve visibility."
    },
    {
      icon: Users,
      title: "Build Talent Pools",
      description: "Maintain relationships with candidates for future opportunities."
    }
  ];

  const quickActions = [
    {
      icon: Search,
      title: "Find Candidates",
      description: "Search and discover talented candidates for your open positions",
      buttonText: "Start Searching",
      onClick: () => window.location.href = '/recruiter/discover',
      color: "bg-blue-500"
    },
    {
      icon: Plus,
      title: "Post New Job",
      description: "Create a new job posting to attract the right candidates",
      buttonText: "Post Job",
      onClick: () => window.location.href = '/recruiter/jobs/new',
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "View Applicants",
      description: "Review and manage all your job applicants and their profiles",
      buttonText: "View Applicants",
      onClick: () => window.location.href = '/recruiter/applicants',
      color: "bg-[#EA4C25]"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName?.split(" ")[0] || "Recruiter"}!
          </h1>
          <p className="text-gray-600">Here's an overview of your recruiting activity</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Applicants"
            value={stats?.applicants || 0}
            color="bg-[#EA4C25]"
          />
          <StatCard
            icon={TrendingUp}
            label="Matches Found"
            value={stats?.matches || 0}
            color="bg-green-500"
          />
          <StatCard
            icon={Search}
            label="Active Jobs"
            value={stats?.activeJobs || 0}
            color="bg-blue-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Getting Started Section */}
        {(stats?.applicants || 9) === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#EA4C25] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Recruiting Journey</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't received any applicants yet. Post your first job or start searching for candidates to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#EA4C25] hover:bg-[#d63e1e] text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Post Your First Job
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
                Browse Candidates
              </button>
            </div>
          </div>
        )}

        {/* Recruiting Tips Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recruiting Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recruitingTips.map((tip, index) => (
              <TipCard key={index} {...tip} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}