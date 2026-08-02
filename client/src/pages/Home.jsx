import MainLayout from "../components/layout/MainLayout";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import CTA from "../components/home/CTA";
import Stats from "../components/home/Stats";

const Home = () => {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Stats />
    </MainLayout>
  );
};

export default Home;