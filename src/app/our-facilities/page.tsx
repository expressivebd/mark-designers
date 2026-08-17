import Image from 'next/image';
import Link from 'next/link';
import { getSisterConcerns } from '@/lib/data';

export const revalidate = 3600;

export default async function SisterConcernsPage() {
    const concerns = await getSisterConcerns();

    return (
        <>
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/p1.jpg"
                    alt="Our Facilities"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-playfair font-bold text-white tracking-tight">
                        OUR FACILITIES
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto mt-6" />
                    {/* <p className="text-white/80 mt-6 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Shared details managed from admin and displayed across all concern pages
                    </p> */}
                </div>
            </section>

            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="space-y-24">
                        {concerns.map((concern, index) => (
                            <div
                                key={concern.id}
                                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
                            >
                                <div className="w-full lg:w-1/2 relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden group">
                                    <Image
                                        src={concern.thumbnailUrl || '/p1.jpg'}
                                        alt={concern.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>

                                <div className="w-full lg:w-1/2 space-y-6">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-primary">
                                        {concern.name}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-accent text-sm font-semibold tracking-wider mb-1">ESTABLISHED</p>
                                            <p className="text-primary text-xl font-playfair font-bold">{concern.establishedYear || '-'}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-accent text-sm font-semibold tracking-wider mb-1">LOCATION</p>
                                            <p className="text-primary text-lg font-semibold">{concern.location || '-'}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-accent text-sm font-semibold tracking-wider mb-1">MANUFACTURING CAPACITY</p>
                                            <p className="text-primary text-xl font-playfair font-bold">{concern.capacity || '-'}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-accent text-sm font-semibold tracking-wider mb-1">PERSONNEL</p>
                                            <p className="text-primary text-xl font-playfair font-bold">{concern.personnel || '-'}</p>
                                        </div>
                                    </div>

                                    <Link href={concern.link} className="btn-primary inline-flex items-center gap-2 group">
                                        <span>Explore</span>
                                        <svg
                                            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {concerns.length === 0 && (
                        <div className="text-center py-20 text-slate-500">No facilities found.</div>
                    )}
                </div>
            </section>
        </>
    );
}
