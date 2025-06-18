import Footer from '@/components/Footer'
import BlogPosts from '@/components/Home/BlogPosts'
import FAQSection from '@/components/Home/FAQSection'
import FeedbackSection from '@/components/Home/FeedbackSection'
import Hero from '@/components/Home/Hero'
import Info from '@/components/Home/Info'
import ServicesSection from '@/components/Home/ServicesSection'
import SkillsSlider from '@/components/Home/SkillsSlider'
import Solutions from '@/components/Home/Solutions'
import Navbar from '@/components/Navbar.jsx'


function Home() {
    return (
        <div>
            <Navbar />
            <div className="px-[3%] grad md:px-[7%] overflow-x-hidden">
            </div>
            <div className="px-[7%] overflow-x-hidden">
                <Hero />
                <Info />
            </div>
            <SkillsSlider />
            <ServicesSection />
            <div className="px-[3%] md:px-[7%] ">
                <Solutions />
            </div>
            <FeedbackSection />
            <BlogPosts />
            <FAQSection />
            <Footer />

        </div>
    )
}

export default Home