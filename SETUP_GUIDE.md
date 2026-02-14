# Mark Designers Ltd. - Setup & Customization Guide

## 🎉 Project Successfully Created!

Your premium corporate website is ready. This guide will help you customize and deploy it.

## 📁 Project Structure

```
mark-designers/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Main home page
│   │   └── globals.css         # Global styles & utilities
│   └── components/
│       ├── Loader.tsx          # Animated loading screen
│       ├── Header.tsx          # Top navigation bar
│       ├── StaggeredMenu.tsx   # Sidebar menu
│       ├── Hero.tsx            # Hero section with video
│       ├── AboutUs.tsx         # About section with stats
│       ├── SisterConcerns.tsx  # Sister concerns showcase
│       ├── Products.tsx        # Products grid
│       ├── Certifications.tsx  # Certification carousel
│       ├── BrandsClients.tsx   # Client logos carousel
│       ├── Sustainability.tsx  # Sustainability commitments
│       ├── News.tsx            # News & media section
│       ├── CallToAction.tsx    # CTA section
│       └── Footer.tsx          # Footer with links
├── public/
│   └── videos/
│       └── hero-video.mp4      # Hero background video (add yours)
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies

```

## 🚀 Getting Started

### Start Development Server

```bash
npm run dev
```

Then open: http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization Guide

### 1. **Colors & Branding**

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    DEFAULT: '#1a2332',  // Deep navy
    dark: '#0f1620',
    light: '#2a3442',
  },
  accent: {
    DEFAULT: '#c9a961',  // Gold
    light: '#d4b877',
    dark: '#b89850',
  },
}
```

### 2. **Typography**

Change fonts in `src/app/layout.tsx`:

```typescript
const playfair = Playfair_Display({ /* Headings */ })
const inter = Inter({ /* Body text */ })
```

Browse fonts: https://fonts.google.com

### 3. **Logo**

Update the logo text in:
- `src/components/Header.tsx` (lines 90-98)
- `src/components/Footer.tsx` (lines 80-86)

Or replace with an image:
```jsx
<Image src="/logo.png" alt="Mark Designers" width={200} height={60} />
```

### 4. **Hero Video**

Place your video at: `public/videos/hero-video.mp4`

**Video requirements:**
- Format: MP4 (H.264)
- Resolution: 1920x1080 or higher
- Duration: 10-30 seconds (will loop)
- Size: Under 5MB recommended

Change video in `src/components/Hero.tsx` (line 38)

### 5. **Content Updates**

#### Contact Information
Update in `src/components/Header.tsx`:
- Location (line 47)
- Email (line 59)
- Phone (line 77)

#### About Us Text
Edit `src/components/AboutUs.tsx` (lines 43-50)

#### Statistics
Update stats in `src/components/AboutUs.tsx` (lines 9-14)

#### Sister Concerns
Edit data in `src/components/SisterConcerns.tsx` (lines 7-27)

#### Products
Update product list in `src/components/Products.tsx` (lines 7-60)

#### Certifications
Update logos in `src/components/Certifications.tsx` (lines 8-17)

Replace placeholder logos with actual logo images in `/public/certifications/`

#### Clients & Brands
Update client logos in `src/components/BrandsClients.tsx` (lines 8-19)

#### News Items
Edit news in `src/components/News.tsx` (lines 7-38)

### 6. **Social Media Links**

Update in:
- `src/components/StaggeredMenu.tsx` (lines 33-37)
- `src/components/Footer.tsx` (lines 65-120)

### 7. **Navigation Links**

Edit menu items in `src/components/StaggeredMenu.tsx` (lines 12-23)

## 🖼️ Adding Images

### Product Images
1. Add images to `public/products/`
2. Update paths in `src/components/Products.tsx`

### Sister Concern Images
1. Add images to `public/sister-concerns/`
2. Update paths in `src/components/SisterConcerns.tsx`

### Logo Images
1. Add to `public/certifications/` and `public/clients/`
2. Update components accordingly

### Using Next.js Image

```jsx
import Image from 'next/image'

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={600}
  height={400}
  className="..."
/>
```

## 🎬 Animation Customization

### Adjust Animation Speed

In any component, modify Framer Motion `duration`:

```jsx
transition={{ duration: 0.6, delay: 0.2 }}
```

### Disable Animations

Remove or comment out `motion` wrappers:

```jsx
// From:
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

// To:
<div>
```

### Change Loader Duration

Edit `src/components/Loader.tsx` (line 22):

```typescript
setTimeout(() => { ... }, 3000); // Change 3000 to desired ms
```

## 📱 Responsive Design

All components are fully responsive. Test breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Tailwind breakpoints:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

## 🌐 SEO & Metadata

Update in `src/app/layout.tsx` (lines 15-19):

```typescript
export const metadata: Metadata = {
  title: 'Your Company Name',
  description: 'Your description',
  keywords: 'your, keywords',
}
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit https://vercel.com
3. Import repository
4. Deploy!

### Deploy to Netlify

```bash
npm run build
# Upload .next folder
```

### Environment Variables

Create `.env.local` for sensitive data:

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🛠️ Advanced Customization

### Add New Pages

1. Create `src/app/about/page.tsx`
2. Add content:

```tsx
export default function AboutPage() {
  return <div>About page content</div>
}
```

### Add Smooth Scroll Library

For advanced smooth scrolling, consider:
- Locomotive Scroll
- GSAP ScrollTrigger

### Add Contact Form

1. Install form library: `npm install react-hook-form`
2. Create form component
3. Integrate with backend API

### Google Analytics

1. Install: `npm install @next/third-parties`
2. Add to layout.tsx
3. Configure tracking

## 📊 Performance Optimization

### Image Optimization
- Use WebP format
- Compress images: https://tinypng.com
- Use Next.js Image component

### Video Optimization
- Compress video: https://handbrake.fr
- Use poster image for fallback
- Consider lazy loading

### Code Splitting
Already handled by Next.js automatically!

### Analyze Bundle
```bash
npm install @next/bundle-analyzer
```

## 🐛 Troubleshooting

### Styles not loading
```bash
npm run build
# Check for Tailwind errors
```

### Images not showing
- Check file paths (case-sensitive)
- Verify images exist in `public/`
- Check Next.js config domains

### Build errors
```bash
npm run lint
npm run build
# Fix reported issues
```

### Port already in use
```bash
# Use different port
npm run dev -- -p 3001
```

## 📚 Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion
- **React Icons:** https://react-icons.github.io/react-icons

## 💡 Tips

1. **Keep it simple:** Don't over-complicate animations
2. **Test on mobile:** Most users browse on phones
3. **Optimize images:** Slow images = slow site
4. **Regular updates:** Keep dependencies updated
5. **Backup:** Always backup before major changes

## 📞 Support

For issues or questions:
1. Check error messages carefully
2. Search in Next.js/React documentation
3. Check browser console for errors
4. Review this guide thoroughly

## ✅ Pre-Launch Checklist

- [ ] Replace all placeholder content
- [ ] Add hero video
- [ ] Update contact information
- [ ] Add real product images
- [ ] Add certification logos
- [ ] Add client logos
- [ ] Update social media links
- [ ] Test all navigation links
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Optimize all images
- [ ] Set up analytics
- [ ] Configure SEO metadata
- [ ] Test contact forms
- [ ] Run performance audit
- [ ] Set up domain name

## 🎉 You're All Set!

Your premium corporate website is ready to customize and deploy. Good luck with your project!

---

**Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and Framer Motion**
