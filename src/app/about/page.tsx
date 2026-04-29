import { getAboutPage, getCertifications } from '@/lib/data';
import AboutPageClient from './AboutPageClient';

export const revalidate = 3600;

export default async function AboutPage() {
    const [aboutDoc, certDocs] = await Promise.all([
        getAboutPage(),
        getCertifications(),
    ]);

    const about = aboutDoc ? {
        journey: aboutDoc.journey,
        stats: aboutDoc.stats,
        facilities: aboutDoc.facilities,
        expertise: aboutDoc.expertise,
    } : null;

    const certifications = certDocs.map((cert) => ({
        id: cert.id,
        name: cert.name,
        logoUrl: cert.logoUrl,
    }));

    return <AboutPageClient about={about} certifications={certifications} />;
}
