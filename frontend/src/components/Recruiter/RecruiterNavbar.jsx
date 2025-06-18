import { Bell, CircleUser, ChevronDown, Menu, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu'
import { Link, useLocation } from 'react-router-dom';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog';
import { logout } from '@/Api/AuthService';
import { toast } from 'react-toastify';

function RecruiterNavbar() {
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState("Home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const navOptions = [
        { id: 1, name: "Home", link: "/recruiter" },
        { id: 2, name: "Jobs", link: "/recruiter/jobs" },
        { id: 3, name: "Applicants", link: "/recruiter/applicants" },
        { id: 4, name: "Discover", link: "/recruiter/discover" },
        { id: 5, name: "Messages", link: "/recruiter/messages" }
    ];

    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath.startsWith('/recruiter/applicants')) {
            setSelectedOption('Applicants');
        } else if (currentPath.startsWith('/recruiter/jobs')) {
            setSelectedOption('Jobs');
        } else if (currentPath.startsWith('/recruiter/discover')) {
            setSelectedOption('Discover');
        } else if (currentPath.startsWith('/recruiter/messages') || currentPath.startsWith('/recruiter/chat')) {
            setSelectedOption('Messages');
        } else if (currentPath === '/recruiter') {
            setSelectedOption('Home');
        } else {
            setSelectedOption('');
        }
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Dummy logout function
    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            const response = await logout();
            if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('persist:root');
                window.location.href = '/'; // Redirect to home page
                toast.success('Logged out successfully!');
            } else {
                toast.error('Logout failed. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred while logging out. Please try again.');
            console.error("Logout Error:", error.response?.data || error.message);
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <>
            <div className="Navbar flex items-center justify-between px-4 md:px-[5%] border-b-2 py-4 sticky top-0 bg-white z-50">
                {/* Mobile Toggle Button - positioned relative to parent container
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden fixed top-3 left-0 z-50 p-2"
                    aria-label="Toggle sidebar"
                >
                    {isSidebarOpen ? <></> : <Menu size={24} />}
                </button> */}
                <div className="text-xl font-bold cursor-pointer md:ml-0 ml-5">SoftHire</div>

                {/* Desktop Navigation - hidden on mobile */}
                <div className="hidden md:flex gap-4 lg:gap-7 font-semibold">
                    {navOptions.map((option) => (
                        <div
                            key={option.id}
                            className={selectedOption === option.name ? "text-[#EA4C25] cursor-pointer" : "cursor-pointer"}
                            onClick={() => setSelectedOption(option.name)}
                        >
                            <Link to={option.link}>{option.name}</Link>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 md:gap-5">
                    <div className="cursor-pointer"><Bell size={22} /></div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="flex items-center gap-1 cursor-pointer">
                                <CircleUser size={22} />
                                <ChevronDown size={18} className="" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* Profile and Settings remain unchanged */}
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            {/* Logout with AlertDialog, styled to match other items */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    {/* Use a button to prevent DropdownMenu from closing on click */}
                                    <button type="button" className="w-full text-black text-left text-sm cursor-pointer px-2 py-1.5 hover:bg-gray-100 ">
                                        Logout
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will remove your account
                                            and your data from your device.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600" disabled={logoutLoading}>
                                            {logoutLoading ? 'Logging out...' : 'Continue'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile menu toggle button */}
                    <button
                        className="md:hidden ml-2 p-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu - only visible when open */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed top-16 left-0 right-0 bg-white z-40 border-b-2 shadow-lg">
                    {navOptions.map((option) => (
                        <Link
                            key={option.id}
                            to={option.link}
                            className={`block py-3 px-5 border-b ${selectedOption === option.name ? "text-[#EA4C25] font-semibold" : ""
                                }`}
                            onClick={() => {
                                setSelectedOption(option.name);
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            {option.name}
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}

export default RecruiterNavbar