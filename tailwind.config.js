/* eslint-disable no-undef */

/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screens: {
			xs: '475px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
		},
		extend: {
			fontFamily: {
				sans: ['Roboto', 'sans-serif'],
			},
			colors: {
				primary: '#eab308',
				secondary: '#fde047',
				background: '#efefef',
			},
			textShadow: {
				textShadow: '4px 4px 2px rgba(0,0,0,0.6)',
			},
			boxShadow: {
				'3xl': '7px 5px 10px 0px rgba(0,0,0,0.62);',
				'2xl': '5px 5px 5px 0px rgba(0,0,0,0.62);',
			},
		},
	},
	plugins: [
		plugin(function ({ addComponents }) {
			const components = {
				// Estilo para .btnprimary
				'.btnprimary': {
					backgroundColor: '#ffd52b',
					color: 'black',
					padding: '8px',
					width: 'auto',
					border: 'none',
					text: 'center',
					display: "flex",  
					alignItems: "center",  
					justifyContent: "center",
					borderRadius: '8px',
					fontWeight: '600',
					'&:hover': {
						backgroundColor: '#fde047',
						color: 'black',
						boxShadow: 'none',
						outline: 'none',
					},
					'&:focus': {
						boxShadow: 'none',
						outline: 'none',
					},
				},
				'.btncancel': {
					backgroundColor: '#4b5563',
					color: '#ffd52b',
					padding: '10px',
					fontWeight: '600',
					borderRadius: '6px',
					border: 'none',
					'&:hover': {
						backgroundColor: '#6b7280',
						boxShadow: 'none',
						outline: 'none',
					},
					'&:focus': {
						boxShadow: 'none',
						outline: 'none',
					},
				},
				// Estilo para .btnicon
				'.btnicon': {
					color: 'black',
					padding: '10px',
					fontSize: '26px',
					fontWeight: '600',
					borderRadius: '0.375rem',
					'&:hover': {
						backgroundColor: '#ffd52b',
						boxShadow: 'none',
						outline: 'none',
					},
					'&:focus': {
						boxShadow: 'none',
						outline: 'none',
					},
				},
				// Estilo para .title
				'.yellowtitle': {
					color: '#ffd52b',
					padding: '10px',
					fontSize: '36px',
					fontWeight: '800',
					text: 'center',
				},
				'.title': {
					color: 'black',
					padding: '10px',
					fontSize: '26px',
					fontWeight: '800',
					text: 'center',
				},
				'.subtitle': {
					color: 'black',
					padding: '10px',
					fontSize: '20px',
					fontWeight: '600',
					text: 'center',
				},
				'.error-message': {
					color: '#dc2626',
					padding: '5px',
					fontSize: '16px',
					fontWeight: '600',
				},
			};
			// Combinar y añadir los componentes
			addComponents(components);
		}),
	],
};
