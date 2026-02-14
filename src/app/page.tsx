import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import SisterConcerns from '@/components/SisterConcerns';
import Products from '@/components/Products';
import Certifications from '@/components/Certifications';
import BrandsClients from '@/components/BrandsClients';
import Sustainability from '@/components/Sustainability';
import News from '@/components/News';
import CallToAction from '@/components/CallToAction';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutUs />
      <SisterConcerns />
      <Products />
      <Certifications />
      <BrandsClients />
      <Sustainability />
      <News />
      <CallToAction />
    </>
  );
}
