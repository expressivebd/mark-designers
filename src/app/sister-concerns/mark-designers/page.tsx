import SisterConcernDetail from '@/components/SisterConcernDetail';

const data = {
    name: 'Mark Designers Limited',
    tagline: 'Our flagship manufacturing facility — where it all began',
    location: 'Gazipur, Dhaka, Bangladesh',
    fullAddress: 'Tongi Industrial Area, Gazipur Sadar, Gazipur 1704, Bangladesh',
    established: '1995',
    heroImage: '/p1.jpg',
    description: [
        'Mark Designers Limited is the founding company of the Mark group, established in 1995 in Gazipur, Bangladesh. Over the decades, it has grown from a small garment unit into a world-class manufacturing facility serving some of the most prestigious fashion brands globally.',
        'With a focus on premium woven and knit garments, the facility is equipped with the latest machinery from Japan, Germany, and Italy. Our 3,000+ skilled workforce produces over 15,000 pieces daily, maintaining the highest standards of quality and compliance.',
        'The factory is fully compliant under the supervision of Accord and RSC, and holds multiple international certifications including ISO 9001, WRAP, BSCI, and OEKO-TEX.',
    ],
    stats: [
        { number: 15000, suffix: '+', label: 'Daily Capacity (pcs)' },
        { number: 3000, suffix: '+', label: 'Personnel' },
        { number: 30, suffix: '+', label: 'Years in Operation' },
        { number: 500, suffix: '+', label: 'Machines' },
    ],
    machineryImages: [
        { src: '/concerns/1.png', alt: 'Sewing Floor', description: 'State-of-the-art sewing lines with automated thread trimming' },
        { src: '/concerns/2.png', alt: 'Cutting Section', description: 'Computerized cutting systems for precision' },
        { src: '/concerns/3.png', alt: 'Finishing Line', description: 'Advanced finishing and pressing equipment' },
        { src: '/products/1.png', alt: 'Quality Lab', description: 'In-house testing and quality control laboratory' },
        { src: '/products/2.png', alt: 'Washing Plant', description: 'Eco-friendly washing facility with water recycling' },
        { src: '/products/3.png', alt: 'Packing Area', description: 'Automated packing and shipping preparation' },
    ],
};

export default function MarkDesignersPage() {
    return <SisterConcernDetail data={data} />;
}
