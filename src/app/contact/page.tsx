import { getContactAddresses } from '@/lib/data';
import ContactPageClient from './ContactPageClient';

export const revalidate = 3600;

export default async function ContactPage() {
    const addressDocs = await getContactAddresses();

    const addresses = addressDocs.map((addr) => ({
        id: addr.id,
        title: addr.title,
        fullAddress: addr.fullAddress,
        phones: addr.phones,
        emails: addr.emails,
        mapLocation: addr.mapLocation,
        mapEmbedUrl: addr.mapEmbedUrl,
        directionUrl: addr.directionUrl,
    }));

    return <ContactPageClient addresses={addresses} />;
}
