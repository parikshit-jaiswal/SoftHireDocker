import { ArrowRight } from 'lucide-react'
import React from 'react'
import Marquee from 'react-fast-marquee'

function EventCard({ img, title, content }) {
    return (
        <div className="rounded-lg p-6 flex-shrink-0 w-80 md:w-auto md:flex-1 flex flex-col snap-center hover:shadow-lg">
            <img
                src={img}
                alt="Office workspace"
                className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">{title}</h2>
            <p className='mt-1'>May 17,2025 | 6:00 p.m</p>
            <p className="text-gray-600 mt-2">
                {content}
            </p>
            <a href="#" className="text-red-500 text-lg hover:font-bold mt-4 w-fit flex items-center">
                Read Now
                <span className='ml-2'><ArrowRight size={20} /></span>
            </a>
        </div>
    )
}

function EventsSection() {
    const eventsData = [
        {
            img: "/hero/blogImg1.png",
            title: "Career Connect 2025",
            content: "Join us for an interactive session on international hiring trends, visa processes, and job market insights to boost your global career.",
        },
        {
            img: "/hero/blogImg2.png",
            title: "SoftHire Recruiters Roundtable",
            content: "Network with industry professionals and discover strategies to streamline your hiring process with SoftHire’s expert tools.",
        },
        {
            img: "/hero/blogImg3.png",
            title: "University Partnership Webinar",
            content: "Explore collaboration opportunities for student placements, internships, and global mobility with our academic partnership team.",
        },
    ];

    return (
        <div className="">
            <div className="py-16 text-center space-y-3">
                <h1 className="text-3xl md:text-5xl font-bold w-full">Upcoming Events</h1>
                <p className='w-full md:w-[50%] mx-auto opacity-80'>
                    Don't miss out on our latest webinars, workshops, and career events—designed to keep you informed and ahead in your journey.
                </p>
            </div>

            {/* Responsive grid for larger screens */}
            <div className="hidden lg:grid lg:grid-cols-3 md:gap-4">
                {eventsData.map((data, index) => (
                    <div key={index} className="col-span-1">
                        <EventCard img={data.img} title={data.title} content={data.content} />
                    </div>
                ))}
            </div>

            {/* Horizontal scrollable container for mobile */}
            <div className="lg:hidden overflow-x-auto hide-scroll">
                <Marquee play={true} autoFill={false} pauseOnHover={true} className='gap-4'>
                    {eventsData.map((data, index) => (
                        <div key={index} className="flex-shrink-0 w-80">
                            <EventCard img={data.img} title={data.title} content={data.content} />
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
    )
}

export default EventsSection