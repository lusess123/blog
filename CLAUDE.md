# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 blog application built with TypeScript that displays daily reading articles. The app features a dynamic routing system for blog posts and includes theme switching capabilities.

## Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
# or
yarn dev
```

### Build & Production
```bash
npm run build        # Build for production
npm start           # Start production server
```

### Code Quality
```bash
npm run lint        # Run ESLint (extends next/core-web-vitals)
```

## Architecture

### Core Structure
- **App Router**: Uses Next.js 13+ app directory structure with TypeScript
- **Dynamic Routes**: `src/app/[day]/page.tsx` handles individual blog post pages
- **Static Generation**: Blog posts are statically generated at build time using `generateStaticParams()`

### Key Directories
- `src/app/` - Next.js app router pages and API routes
- `src/components/` - React components (theme system)
- `src/contexts/` - React context providers (ThemeContext)
- `src/util/` - Utility functions for file operations
- `blogs/read-daily/` - Markdown blog posts (format: `YYYY年MM月.md`)

### Blog System Architecture
The application reads markdown files from `blogs/read-daily/` directory:
- File naming convention: `2023年11月.md` (Year年Month月.md)
- Files are converted to URL format: `202311` for routing
- Home page lists all posts sorted by date (newest first)
- Individual post pages render markdown with ReactMarkdown

### Theme System
- `ThemeProvider` context manages theme state
- `ThemeWrapper` component applies theme classes
- `ThemeSelector` component provides theme switching UI

### Image Handling
- Uses Next.js Image component with optimization
- Supports remote images from `https://file.zyking.xyz/api`
- Images are proxied through custom API endpoint for external sources

### Key Components
- `src/app/page.tsx` - Home page with blog post listing
- `src/app/[day]/page.tsx` - Individual blog post renderer
- `src/util/file-util.ts` - File system operations and blog post discovery
- `src/app/layout.tsx` - Root layout with theme providers

### Dependencies
- **React Markdown**: `react-markdown` with `remark-gfm` for GitHub-flavored markdown
- **Rehype**: `rehype-raw` for raw HTML in markdown
- **Styling**: Tailwind CSS with custom SCSS files
- **Fonts**: Inter font via `next/font/google`

## Development Notes

### Path Resolution
- Uses `@/*` path mapping pointing to `src/*`
- Import paths should use the `@/` alias for src directory imports

### Markdown Processing
- Markdown content supports HTML tags via `rehype-raw`
- Images are automatically processed and optimized
- External CDN URLs are proxied through local API

### File Operations
- Blog post discovery uses Node.js `fs` module in `file-util.ts`
- File reading happens at build time for static generation
- Posts are sorted chronologically on the home page