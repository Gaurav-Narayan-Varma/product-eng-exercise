/** @type {import('tailwindcss').Config} */

export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			'app-background': '#FFF',
  			'primary-main': '#3A3888',
  			'primary-action-light': '#ECEBFF',
  			'primary-light': '#DAD9FF',
  			'selected-gray': '#F8F8F8',
  			'black-text': '#2A2A2A',
  			'gray-text': '#414141',
  			'gray-600': '#AFAFAF',
  			'dusty-white': '#F8F8F8',
  			'light-dusty-white': '#FCFCFC',
  			'hover-gray': '#F1F1F1',
  			white: '#FFF',
  			'tag-light-blue': '#D4EAFF',
  			'tag-dark-blue': '#21588B',
  			'tag-light-pink': '#FDD5F7',
  			'tag-dark-pink': '#9C1C87',
  			'tag-light-orange': '#FFE0D6',
  			'tag-dark-orange': '#C06614',
  			'tag-light-yellow': '#FFF4CD',
  			'tag-dark-yellow': '#996E00',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderColor: {
  			DEFAULT: '#E2E2E2'
  		},
  		borderWidth: {
  			'1': '1',
  			DEFAULT: '0.5'
  		},
  		flex: {
  			fit: '1'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
