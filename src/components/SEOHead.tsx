'use client';

import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
}

export default function SEOHead({ title, description, keywords }: SEOProps) {
    useEffect(() => {
        document.title = `${title} | Mark Designers Ltd`;

        const setMeta = (name: string, content: string, property?: boolean) => {
            const attr = property ? 'property' : 'name';
            let el = document.querySelector(`meta[${attr}="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('description', description);
        if (keywords) setMeta('keywords', keywords);
        setMeta('og:title', `${title} | Mark Designers Ltd`, true);
        setMeta('og:description', description, true);
        setMeta('twitter:title', `${title} | Mark Designers Ltd`);
        setMeta('twitter:description', description);
    }, [title, description, keywords]);

    return null;
}
