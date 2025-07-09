import { ChevronRight } from "lucide-react";
import React, { useRef, useEffect } from "react";

const BlogPosts = () => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const centerMiddleCard = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const containerWidth = container.offsetWidth;
        const cardWidth = container.children[1].offsetWidth;

        container.scrollTo({
          left: cardWidth + 24 - containerWidth / 2 + cardWidth / 2,
          behavior: "smooth",
        });
      }
    };

    centerMiddleCard();
    window.addEventListener("resize", centerMiddleCard);

    return () => window.removeEventListener("resize", centerMiddleCard);
  }, []);

  return (
    <div className="md:py-0 py-10 md:min-h-screen bg-[#E9EEF4] flex flex-col items-center justify-center p-0 mid:p-6 md:pb-32 pb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 md:mb-12 mt-10 md:mt-20">
        Latest Blogs
      </h1>

      <div className="w-full max-w-7xl px-0 md:px-4">
        <div
          ref={scrollContainerRef}
          className="flex flex-row md:gap-6 overflow-x-auto hide-scroll pb-6 md:flex-wrap md:justify-center snap-x snap-mandatory"
        >
          <div className="rounded-lg p-6 flex-shrink-0 w-80 md:w-auto md:flex-1 flex flex-col  snap-center">
            <img
              src="/hero/blogImg1.png"
              alt="Office workspace"
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
              What Is a UK Sponsorship License?
            </h2>
            <p className="text-gray-600 mt-2">
              Discover emerging trends in global software recruitment, visa
              regulations, and remote hiring strategies.
            </p>
            <a
              href="/uk-license-blog"
              className="text-red-500 mt-4 hover:underline w-fit flex items-center"
            >
              Read More{" "}
              <p className="mt-[3px]">
                {" "}
                <ChevronRight size={24} />
              </p>
            </a>
          </div>

          <div className="rounded-lg p-6 flex-shrink-0 w-80 md:w-auto md:flex-1 flex flex-col  snap-center">
            <img
              src="/hero/blogImg2.png"
              alt="Person with laptop"
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
              Why We Built SoftHire
            </h2>
            <p className="text-gray-600 mt-2">
              Understand the latest updates to UK Skilled Worker visa policies
              and what employers and candidates need to know before applying.
            </p>
            <a
              href="/why-softhire-blog"
              className="text-red-500 mt-4 hover:underline w-fit flex items-center"
            >
              Read More{" "}
              <p className="mt-[3px]">
                {" "}
                <ChevronRight size={24} />
              </p>
            </a>
          </div>

          <div className=" rounded-lg p-6 flex-shrink-0 w-80 md:w-auto md:flex-1 flex flex-col snap-center">
            <img
              src="/hero/blogImg3.png"
              alt="Team collaboration"
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
              How to Become a Licensed Sponsor
            </h2>
            <p className="text-gray-600 mt-2">
              A comprehensive guide for UK businesses looking to hire global
              talent legally and efficiently through the sponsor license route.
            </p>
            <a
              href="#"
              className="text-red-500 mt-4 hover:underline w-fit flex items-center"
            >
              Read More{" "}
              <p className="mt-[3px]">
                {" "}
                <ChevronRight size={24} />
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPosts;
