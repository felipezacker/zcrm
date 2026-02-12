/** @type {import('tailwindcss').Config} */

// Import design tokens from UX Designer (Phase D - Design System)
import tokens from './squads/design-system/tokens.tailwind.js';

const config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./features/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    // Note: In Tailwind v4, most configuration is done in CSS with @theme
    // This file is kept for content scanning and legacy compatibility
    darkMode: 'class',
    theme: {
        extend: {
            // Spread design tokens from UX Designer
            ...tokens,
            // Mobile-first breakpoints (Phase D)
            screens: {
                'xs': '320px',    // iPhone SE
                'sm': '375px',    // Small phones
                'md': '640px',    // Large phones
                'lg': '1024px',   // Tablet
                'xl': '1280px',   // Laptop
                '2xl': '1536px',  // Desktop
            },
            // Override fontFamily to preserve existing Inter variable
            fontFamily: {
                sans: ['var(--font-inter)', 'var(--font-sans)', 'Inter', 'sans-serif'],
                display: ['Space Grotesk', 'var(--font-display)', 'sans-serif'],
                serif: ['Cinzel', 'var(--font-serif)', 'serif'],
            },
            // Keep existing dark colors for backwards compatibility
            colors: {
                ...tokens.colors,
                // Semantic Colors (OKLCH from globals.css)
                bg: 'var(--color-bg)',
                surface: 'var(--color-surface)',
                muted: 'var(--color-muted)',
                border: 'var(--color-border)',
                'border-subtle': 'var(--color-border-subtle)',

                // Text Colors
                primary: 'var(--color-text-primary)',
                secondary: 'var(--color-text-secondary)',
                'text-muted': 'var(--color-text-muted)',
                'text-subtle': 'var(--color-text-subtle)',

                // Status Colors
                success: 'var(--color-success)',
                'success-bg': 'var(--color-success-bg)',
                'success-text': 'var(--color-success-text)',

                warning: 'var(--color-warning)',
                'warning-bg': 'var(--color-warning-bg)',
                'warning-text': 'var(--color-warning-text)',

                error: 'var(--color-error)',
                'error-bg': 'var(--color-error-bg)',
                'error-text': 'var(--color-error-text)',

                info: 'var(--color-info)',
                'info-bg': 'var(--color-info-bg)',
                'info-text': 'var(--color-info-text)',

                orange: 'var(--color-orange)',
                'orange-bg': 'var(--color-orange-bg)',
                'orange-text': 'var(--color-orange-text)',

                dark: {
                    bg: '#020617',
                    card: '#0f172a',
                    border: '#1e293b',
                    hover: '#334155',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}

export default config
