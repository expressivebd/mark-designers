import SisterConcernDetail from '@/components/SisterConcernDetail';

const data = {
    name: 'Mark Wear Limited',
    tagline: 'Where contemporary fashion meets manufacturing excellence',
    location: 'Narayanganj, Dhaka, Bangladesh',
    fullAddress: 'Fatullah Industrial Zone, Narayanganj 1420, Bangladesh',
    established: '2005',
    heroImage: '/p2.jpg',
    description: [
        'Mark Wear Limited was established in 2005 to meet the growing demand for contemporary fashion and casualwear manufacturing. Located in Narayanganj, one of Bangladesh\'s most prominent industrial hubs, the facility has quickly become a center of excellence.',
        'Specializing in knit garments, polo shirts, t-shirts, and active lifestyle apparel, Mark Wear Limited operates with a workforce of 3,500+ personnel producing over 18,000 pieces daily.',
        'The facility features advanced knitting, dyeing, and finishing capabilities all under one roof, enabling us to offer a fully vertical manufacturing solution to our clients.',
    ],
    stats: [
        { number: 18000, suffix: '+', label: 'Daily Capacity (pcs)' },
        { number: 3500, suffix: '+', label: 'Personnel' },
        { number: 20, suffix: '+', label: 'Years in Operation' },
        { number: 650, suffix: '+', label: 'Machines' },
    ],
    machineryImages: [
        { src: '/concerns/2.png', alt: 'Knitting Section', description: 'Circular and flat-bed knitting machines from Germany' },
        { src: '/concerns/1.png', alt: 'Dyeing Plant', description: 'Eco-friendly dyeing with effluent treatment' },
        { src: '/products/4.png', alt: 'Sewing Lines', description: 'Modern sewing lines with automated systems' },
        { src: '/concerns/3.png', alt: 'Embroidery Unit', description: 'Multi-head embroidery machines for intricate designs' },
        { src: '/products/1.png', alt: 'Screen Printing', description: 'Advanced screen and digital printing capabilities' },
        { src: '/products/3.png', alt: 'Warehouse', description: 'Climate-controlled storage and logistics center' },
    ],
};

export default function MarkWearPage() {
    return <SisterConcernDetail data={data} />;
}
