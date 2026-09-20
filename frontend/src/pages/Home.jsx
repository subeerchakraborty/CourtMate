import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import PopularGames from "../components/PopularGames";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import WhyCourtMate from "../components/WhyCourtMate";
import CallToAction from "../components/CallToAction";

function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PopularGames />
      <WhyCourtMate />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}

export default Home;
