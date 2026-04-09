import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import SisterConcerns from '@/components/SisterConcerns';
import Products from '@/components/Products';
import Certifications from '@/components/Certifications';
import BrandsClients from '@/components/BrandsClients';
import Sustainability from '@/components/Sustainability';
import News from '@/components/News';
import CallToAction from '@/components/CallToAction';
import {
  getHomepage,
  getSisterConcerns,
  getHomeProducts,
  getCertifications,
  getClients,
  getNews,
} from '@/lib/data';

export default async function Home() {
  const [homepage, sisterConcerns, products, certifications, clients, news] = await Promise.all([
    getHomepage(),
    getSisterConcerns(),
    getHomeProducts(),
    getCertifications(),
    getClients(),
    getNews(),
  ]);

  return (
    <>
      <Hero data={homepage?.hero} />
      <AboutUs text={homepage?.about?.text} stats={homepage?.about?.stats} />
      <SisterConcerns items={sisterConcerns} />
      <Products items={products} />
      <Certifications items={certifications} />
      <BrandsClients items={clients} />
      <Sustainability items={homepage?.sustainability} />
      <News items={news} />
      <CallToAction />
    </>
  );
}
