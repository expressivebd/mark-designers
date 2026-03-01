import SisterConcernDetail from '@/components/SisterConcernDetail';

const data = {
    name: 'Mark 2000 Limited',
    tagline: 'Next-generation manufacturing with cutting-edge technology',
    location: 'Savar, Dhaka, Bangladesh',
    fullAddress: 'Hemayetpur, Savar, Dhaka 1340, Bangladesh',
    established: '2012',
    heroImage: '/p3.jpg',
    description: [
        'Mark 2000 Limited represents the future of garment manufacturing. Established in 2012 in Savar, this facility was designed from the ground up with the latest technology, sustainability, and worker welfare at its core.',
        'The facility specializes in technical and performance apparel, including outerwear, activewear, and specialized garments. With a workforce of 2,500+ and a capacity of 12,000 pieces daily, it combines automation with skilled craftsmanship.',
        'Mark 2000 is a LEED-certified green factory, featuring solar panels, rainwater harvesting, and an advanced effluent treatment plant, making it one of the most environmentally responsible garment factories in Bangladesh.',
    ],
    stats: [
        { number: 12000, suffix: '+', label: 'Daily Capacity (pcs)' },
        { number: 2500, suffix: '+', label: 'Personnel' },
        { number: 12, suffix: '+', label: 'Years in Operation' },
        { number: 400, suffix: '+', label: 'Machines' },
    ],
    machineryImages: [
        { src: '/concerns/3.png', alt: 'Automated Cutting', description: 'Laser and automated spreading & cutting systems' },
        { src: '/products/2.png', alt: 'Heat Sealing', description: 'Seam sealing and bonding technology for waterproof garments' },
        { src: '/concerns/1.png', alt: 'CAD Department', description: 'Computer-aided design and pattern making' },
        { src: '/products/4.png', alt: 'Testing Lab', description: 'In-house fabric and garment testing laboratory' },
        { src: '/concerns/2.png', alt: 'Solar Panels', description: 'Rooftop solar installation powering 30% of operations' },
        { src: '/products/1.png', alt: 'ETP Plant', description: 'Advanced effluent treatment and water recycling' },
    ],
};

export default function Mark2000Page() {
    return <SisterConcernDetail data={data} />;
}
