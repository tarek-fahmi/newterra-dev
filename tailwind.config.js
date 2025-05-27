/* eslint-env node */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        // Vibrant earthy agriculture brand colors with high-contrast
        primary: {
          DEFAULT: 'var(--primary, #2D5016)', // Deep vibrant forest green
          foreground: 'var(--primary-foreground, #fff)',
        },
        secondary: {
          DEFAULT: 'var(--secondary, #228B22)', // Vibrant forest green
          foreground: 'var(--secondary-foreground, #fff)',
        },
        accent: {
          DEFAULT: 'var(--accent, #4A90E2)', // Bright sky blue
          foreground: 'var(--accent-foreground, #fff)',
        },
        destructive: {
          DEFAULT: 'var(--destructive, #E74C3C)', // Bright coral red
          foreground: '#fff',
        },
        warning: {
          DEFAULT: 'var(--soft-yellow, #F4D03F)', // Vibrant golden yellow
          foreground: 'var(--charcoal, #2C3E50)',
        },
        card: {
          DEFAULT: 'var(--card, #fff)',
          foreground: 'var(--card-foreground, #2C3E50)',
        },
        border: 'var(--border, #D2B48C)', // Earthy tan
        muted: {
          DEFAULT: 'var(--muted, #D2B48C)', // Earthy tan
          foreground: 'var(--muted-foreground, #2C3E50)',
        },
        background: 'var(--background, #F5F5DC)', // Warm beige
        foreground: 'var(--foreground, #2C3E50)', // Deep blue-gray charcoal
        // Modern earthy neutrals
        charcoal: '#2C3E50', // Deep blue-gray charcoal
        slate: '#5D6D7E', // Medium blue-gray
        'light-gray': '#BDC3C7', // Light neutral gray
        'off-white': '#F8F9FA', // Clean off-white
        // Vibrant earthy agriculture brand
        'forest-green': '#2D5016', // Deep vibrant forest green
        sage: '#6B8E23', // Vibrant olive green
        'earth-brown': '#8B4513', // Rich saddle brown
        'sky-blue': '#4A90E2', // Bright sky blue
        'warm-beige': '#F5F5DC', // Warm beige
        'vibrant-green': '#228B22', // Vibrant forest green accent
        'earth-tan': '#D2B48C', // Earthy tan
      },
      borderRadius: {
        sm: 'calc(var(--radius, 8px) - 4px)',
        md: 'calc(var(--radius, 8px) - 2px)',
        lg: 'var(--radius, 8px)',
        xl: 'calc(var(--radius, 8px) + 4px)',
      },
    },
  },
  plugins: [],
}; 