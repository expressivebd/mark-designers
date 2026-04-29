import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import SisterConcerns from '@/components/SisterConcerns';
import Products from '@/components/Products';
import Certifications from '@/components/Certifications';
import BrandsClients from '@/components/BrandsClients';
import Sustainability from '@/components/Sustainability';
import CallToAction from '@/components/CallToAction';
import {
  getHomepage,
  getSisterConcerns,
  getHomeProducts,
  getCertifications,
  getClients,
} from '@/lib/data';

export const revalidate = 3600;

export default async function Home() {
  const [homepage, sisterConcerns, products, certifications, clients] = await Promise.all([
    getHomepage(),
    getSisterConcerns(),
    getHomeProducts(),
    getCertifications(),
    getClients(),
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
      <CallToAction />
    </>
  );
}
