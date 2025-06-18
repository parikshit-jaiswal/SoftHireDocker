import React, { useState } from 'react';
import DropdownMenu from './miniComponents/DropdownMenu';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="h-16 lg:h-16 w-full flex justify-between items-center px-5 md:px-[5%] bg-white z-50 fixed top-0 transition-all duration-300 shadow-md">
                <Link to="/" className="logo text-2xl lg:text-2xl font-bold cursor-pointer">
                    <img className='h-10 lg:h-12' src="/softHireLogo.png" alt="Logo" />
                </Link>
                <div className="hidden lg:flex navOption items-center font-semibold gap-10">
                    <Link to="/" className="hover:text-[#011627] transition-colors duration-200 cursor-pointer">Home</Link>
                    <DropdownMenu title="Platform" subheading={[{ name: "Candidate", route: "/" }, { name: "Recruiter", route: "/" }]} />
                    <Link to="/pricing" className="hover:text-[#011627] transition-colors duration-200 cursor-pointer">Pricing</Link>
                    <DropdownMenu title="Resources" subheading={[{ name: "Blogs", route: "/blogs" }, { name: "Tools", route: "/tools" }]} />
                    <Link to="/about" className="hover:text-[#011627] transition-colors duration-200 cursor-pointer">About</Link>
                    <Link to="/contact" className="hover:text-[#011627] transition-colors duration-200 cursor-pointer">Contact Us</Link>
                </div>
                <div className="hidden lg:flex navRight gap-5 items-center">
                    <DropdownMenu title="Login" subheading={[{ name: "Candidate", route: "/login" }, { name: "Recruiter", route: "/login" }]} />
                    <Link to="/demo">
                        <Button variant="round" size="round">Request a Demo</Button>
                    </Link>
                </div>
                <div className="lg:hidden flex items-center">
                    <button onClick={toggleMenu} className="p-2 focus:outline-none" aria-label="Toggle menu">
                        {isOpen ? <X size={40} className="text-[#011627] transition-transform duration-300" /> : <Menu size={40} className="transition-transform duration-300" />}
                    </button>
                </div>
            </div>

            <div className={`fixed top-16 left-0 right-0 bg-white shadow-lg z-40 transition-all duration-300 ease-in-out lg:hidden overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col p-5 space-y-5">
                    <Link to="/" className="py-3 px-4 hover:bg-gray-100 transition-colors duration-200 rounded-md font-semibold">Home</Link>
                    <DropdownMenu title="Platform" subheading={[{ name: "Candidate", route: "/" }, { name: "Recruiter", route: "/" }]} />
                    <Link to="/pricing" className="py-3 px-4 hover:bg-gray-100 transition-colors duration-200 rounded-md font-semibold">Pricing</Link>
                    <DropdownMenu title="Resources" subheading={[{ name: "Blogs", route: "/blogs" }, { name: "Tools", route: "/tools" }]} />
                    <Link to="/about" className="py-3 px-4 hover:bg-gray-100 transition-colors duration-200 rounded-md font-semibold">About</Link>
                    <Link to="/contact" className="py-3 px-4 hover:bg-gray-100 transition-colors duration-200 rounded-md font-semibold">Contact Us</Link>
                    <div className="border-t border-gray-200 pt-5">
                        <DropdownMenu title="Login" subheading={[{ name: "Login", route: "/login" }]} />
                        <div className="px-4 pt-3">
                            <Link to="/demo">
                                <Button variant="round" size="round" className="w-full">Request a Demo</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={toggleMenu} aria-hidden="true" />
            )}
        </>
    );
}

export default Navbar;
