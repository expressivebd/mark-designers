# Mark Designers Ltd. - Premium Corporate Website

A modern, elegant corporate website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🎨 Premium corporate aesthetic
- 🚀 Optimized performance
- ♿ Accessible components
- 🎯 Clean component architecture

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Fonts:** Playfair Display + Inter

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main home page
│   └── globals.css         # Global styles
├── components/
│   ├── Loader.tsx          # Loading screen
│   ├── Header.tsx          # Header/Navbar
│   ├── StaggeredMenu.tsx   # Sidebar menu
│   ├── Hero.tsx            # Hero section
│   ├── AboutUs.tsx         # About section
│   ├── SisterConcerns.tsx  # Sister concerns
│   ├── Products.tsx        # Products showcase
│   ├── Certifications.tsx  # Certifications carousel
│   ├── BrandsClients.tsx   # Clients carousel
│   ├── Sustainability.tsx  # Sustainability section
│   ├── News.tsx            # News & media
│   ├── CallToAction.tsx    # CTA section
│   └── Footer.tsx          # Footer
```

## Customization

### Colors

Edit the color palette in `tailwind.config.js`:

```js
colors: {
  primary: '#1a2332',
  accent: '#c9a961',
  // Add more colors...
}
```

### Content

Update component content directly in each component file under `src/components/`

### Fonts

Change fonts in `src/app/layout.tsx`:

```typescript
const playfair = Playfair_Display({ ... })
const inter = Inter({ ... })
```

## Build for Production

```bash
npm run build
npm start
```

## Deployment

Deploy easily on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## License

© 2026 Mark Designers Ltd. All rights reserved.
