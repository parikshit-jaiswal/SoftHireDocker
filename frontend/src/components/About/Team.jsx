import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

import AliceImage from "../assets/image1.jpg";
import BobImage from "../assets/image2.jpg";
import CharlieImage from "../assets/image3.jpg";
import DianaImage from "../assets/image.jpg";

const teamMembers = [
  {
    id: 1,
    name: "Alice",
    role: "UI/UX Designer",
    description: "Expert in user experience and interface design.",
    image: AliceImage,
  },
  {
    id: 2,
    name: "Bob",
    role: "Frontend Developer",
    description: "Specializes in building interactive UIs.",
    image: BobImage,
  },
  {
    id: 3,
    name: "Charlie",
    role: "Backend Engineer",
    description: "Works on database and server-side logic.",
    image: CharlieImage,
  },
  {
    id: 4,
    name: "Diana",
    role: "Project Manager",
    description: "Leads projects and ensures timely delivery.",
    image: DianaImage,
  },
];

const TeamSection = () => {
  const [startIndex, setStartIndex] = React.useState(0);

  const visibleItems = teamMembers.slice(startIndex, startIndex + 4);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        The Minds Behind SoftHire
      </h2>
      <div className="grid grid-cols-4 gap-6">
        {visibleItems.map((member) => (
          <div
            key={member.id}
            className="relative w-full h-64 perspective-1000"
          >
            <motion.div
              className="relative w-full h-full rounded-lg shadow-lg"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.5 }}
            >
              {/* Front Side */}
              <div className="absolute w-full h-full rounded-lg backface-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              {/* Back Side */}
              <div
                className="absolute w-full h-full bg-[#7D97AE] text-white flex flex-col justify-start p-6 rounded-lg"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <h3 className="font-bold text-2xl">{member.name}</h3>
                <p className="text-lg mt-1">{member.role}</p>
                <p className="text-sm mt-4">{member.description}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() =>
            setStartIndex(
              (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
            )
          }
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() =>
            setStartIndex((prev) => (prev + 1) % teamMembers.length)
          }
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default TeamSection;
