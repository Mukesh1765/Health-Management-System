import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import AboutUs from "../components/AboutUs.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {
    return (
        <div className="app">
            <Header />
            <Hero />
            <Features />
            <AboutUs />
            <Footer />
        </div>
    );
};
export default Home;
