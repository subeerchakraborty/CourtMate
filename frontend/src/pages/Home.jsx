import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import PopularGames from "../components/PopularGames";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PopularGames />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;