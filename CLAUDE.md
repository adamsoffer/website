# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server on localhost:3000
- `npm run build` — production build (use to verify changes compile)
- `npm run lint` — run ESLint

## Stack

Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion 11. No test framework is configured yet.

## Architecture

- **Pages**: `app/` directory with App Router. Pages: home (`/`), developers, lpt, community, blog, primer.
- **Homepage sections**: `components/home/` — each section is a self-contained component (Hero, WhatIsLivepeer, Capabilities, WhyLivepeer, NetworkStats, BuiltOnLivepeer, NetworkParticipants, DeveloperCTA, CommunityCTA). Section order is controlled in `app/page.tsx`.
- **Layout**: `components/layout/` — Header and Footer, shared across all pages via `app/layout.tsx`.
- **UI primitives**: `components/ui/` — Button, Card, Container, SectionHeader, Badge, ImageMask, etc. Reuse these; don't create new wrappers for the same purpose.
- **Icons**: `components/icons/LivepeerLogo.tsx` exports `LivepeerSymbol` (icon only), `LivepeerTextmark` (text only), `LivepeerWordmark` (icon + text).
- **Constants**: `lib/constants.ts` — navigation items and external links. `lib/fonts.ts` — Favorit Pro and Favorit Mono local font config.

## Brand & Styling

- **Full brand reference**: See `brand-tokens.md` for complete color palette, typography specs, logo usage rules, greyscale ramp, gradient definitions, and graphic element guidelines (condensed from the Holographic brand guidelines).
- Tailwind v4 theme defined in `app/globals.css` using `@theme` block — custom colors (`green`, `dark`, `blue`), fonts (`--font-sans`, `--font-mono`).
- CSS utility classes: `.text-gradient` (green gradient text), `.divider-gradient` (section separator line), `.tile-bg` (subtle grid pattern).
- Custom keyframe animations in globals.css: `breathe`, `node-pulse`, `scanLine`, `imageMaskFlow`.
- **Fonts**: Favorit Pro (`font-sans`, weights: Book/Regular/Medium/Bold) for body/headings. Favorit Mono (`font-mono`, weights: Regular/Medium/Bold) for stats, labels, and code. Both by Dinamo Typefaces.
- **Primary colors**: Accent Green `#18794E`, Primary Black `#181818`, Primary White `#FFFFFF`. Use Tailwind theme tokens, not raw hex.
- **Primary gradient**: `#171717 → #18794E → #6DB09C` (for hero backgrounds, overlays).
- **Greyscale**: 11-step ramp from `#181818` (Black 100) to `#FFFFFF` (White). Full table in `brand-tokens.md`.
- **Line heights**: Display headings 93%, mono labels 120%, body text 100%.
- **Logo**: Symbol (play-button from 6 squares) + Wordmark (Favorit Pro with notched E's). White on dark/gradient, black on light. Clear space = symbol width.
- **Graphic elements**: Grain texture (on all gradients), grid overlays, pixel overlays, geometric line shapes. Layered to create depth.
- Dark theme only. All pages use dark backgrounds with white/opacity text.

## Dev Server

- After making code changes, always restart the dev server: kill port 3000, then run `npm run dev` in the background.
- Verify the server is healthy with a curl check before continuing.

## Key Patterns

- All homepage sections and interactive components use `"use client"` directive.
- Scroll animations use Framer Motion's `whileInView` with `viewport={{ once: true }}` and staggered children.
- Section headers use the `SectionHeader` component with `label`, `title`, and `description` props.
- Sections are separated with `.divider-gradient` divs at top or bottom.
- The project brief with full messaging and positioning context is in `livepeer-website-brief.md`.

## Messaging

- Livepeer is **open infrastructure for real-time AI video** — not just transcoding.
- The network IS the product. Daydream, Studio, Streamplace are built ON it, not the other way around.
- Voice: confident, technical but accessible, no-nonsense.
