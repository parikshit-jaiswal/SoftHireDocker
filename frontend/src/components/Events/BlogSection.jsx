import { ArrowRight, Calendar, Clock } from 'lucide-react'
import React from 'react'
import Marquee from 'react-fast-marquee'
import { href } from 'react-router-dom'

function BlogCard({ Blogdata }) {
    return (
        <div className="rounded-lg p-6 flex-shrink-0 w-80 md:w-auto md:flex-1 flex flex-col space-y-4 hover:shadow-lg">
            <img
                src={Blogdata.img}
                alt="Blog post cover"
                className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <div className="text-xl md:text-2xl font-bold">{Blogdata.data}</div>
            <div className="flex justify-between text-sm md:text-base text-gray-600">
                <div className="flex justify-center items-center gap-2">
                    <Calendar size={18} strokeWidth={2.5} />
                    <p>{Blogdata.date}</p>
                </div>
                <div className="flex justify-center items-center gap-2">
                    <Clock size={18} strokeWidth={2.5} />
                    <p>{Blogdata.time}</p>
                </div>
            </div>
            <a href={Blogdata.href} className="text-red-500 text-lg hover:font-bold mt-4 w-fit flex items-center">
                Read Now
                <span className='ml-2'><ArrowRight size={20} /></span>
            </a>
        </div>
    )
}

function BlogSection() {
    const Blogdata = [
        {
            img: "/hero/blogImg1.png",
            data: "What Is a UK Sponsorship License?",
            date: "March 10,2024",
            time: "8 min read",
            href: "/uk-license-blog"
        },
        {
            img: "/hero/blogImg2.png",
            data: "Why We Built SoftHire",
            date: "March 10,2024",
            time: "8 min read",
            href: "/why-softhire-blog"
        },
        {
            img: "/hero/blogImg3.png",
            data: "How to Become a Licensed Sponsor",
            date: "March 10,2024",
            time: "8 min read",
        },
        {
            img: "/hero/blogImg2.png",
            data: "Hiring Made Easy",
            date: "March 10,2024",
            time: "8 min read",
        },
        {
            img: "/hero/blogImg3.png",
            data: "Visa Tips You Need",
            date: "March 10,2024",
            time: "8 min read",
        },
        {
            img: "/hero/blogImg1.png",
            data: "Stand Out as a Candidate",
            date: "March 10,2024",
            time: "8 min read",
        },


    ]

    return (
        <div className="bg-[#E9EEF4]  px-4 md:px-[7%] pb-12">
            <div className="py-16 text-center space-y-3">
                <h1 className="text-3xl md:text-5xl font-bold">Latest Blogs</h1>
            </div>

            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                {Blogdata.map((data, index) => (
                    <div key={index} className="col-span-1">
                        <BlogCard Blogdata={data} />
                    </div>
                ))}
            </div>


            <div className="md:hidden overflow-x-scroll hide-scroll">
                <Marquee direction='right' pauseOnHover={true} className="flex space-x-4 pb-4">
                    {Blogdata.map((data, index) => (
                        <div key={index} className="flex-shrink-0 ">
                            <BlogCard Blogdata={data} />
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
    )
}

export default BlogSection