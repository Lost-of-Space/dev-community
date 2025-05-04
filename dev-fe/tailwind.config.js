import { createThemes } from 'tw-colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {

        colors: {
            'white-404': '#FFFFFF',
            'black-404': '#242424',
            'grey-404': '#F3F3F3'
        },

        fontSize: {
            'sm': '12px',
            'base': '14px',
            'xl': '16px',
            '2xl': '20px',
            '3xl': '28px',
            '4xl': '38px',
            '5xl': '50px',
        },

        extend: {
            fontFamily: {
                monogeist: ["'Geist Mono'", "sans-serif"],
                sansmono: ["'Noto Sans Mono'", "sans-serif"],
                monospace: ["'Space Mono'", "sans-serif"],
                inter: ["'Inter'", "sans-serif"],
                gelasio: ["'Gelasio'", "serif"]
            },
            keyframes: {
                slideToLeft: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                slideToRight: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                slideBackLeft: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                slideBackRight: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                slideToLeft: 'slideToLeft 0.7s ease',
                slideToRight: 'slideToRight 0.7s ease',
                slideBackLeft: 'slideBackLeft 0.7s ease',
                slideBackRight: 'slideBackRight 0.7s ease',
            },

        },

    },
    plugins: [
        createThemes({
            light: {
                'white': '#FFFFFF',
                'black': '#242424',
                'grey': '#F3F3F3',
                'dark-grey': '#6B6B6B',
                'red': '#FF4E4E',
                'transparent': 'transparent',
                'twitter': '#1DA1F2',
                'purple': '#8B46FF',
                'royalblue': '#4070f4',
                'cornflowerblue': '#696CFE'
            },
            dark: {
                'white': '#242424',
                'black': '#F3F3F3',
                'grey': '#2E2E2E',
                'dark-grey': '#E7E7E7',
                'red': '#991F1F',
                'transparent': 'transparent',
                'twitter': '#1DA1F2',
                'purple': '#582C8E',
                'royalblue': '#4070f4',
                'cornflowerblue': '#696CFE'
            }
        })
    ],
};