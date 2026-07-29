/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                ink: '#0f1729',
                muted: '#5b6478',
                surface: '#ffffff',
                canvas: '#f7f8fc',
                border: '#e3e7ef',
                brand: {
                    50: '#eaf2ff',
                    100: '#d4e6ff',
                    200: '#a9cdff',
                    300: '#7eb4ff',
                    400: '#5498f8',
                    500: '#2f7df6',
                    600: '#1d62d0',
                    700: '#1850a8',
                    800: '#133e80',
                    900: '#0d2d5b',
                },
                success: {
                    50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669', 700: '#047857',
                },
                warning: {
                    50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706',
                },
                error: {
                    50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626',
                },
                accent: {
                    50: '#fff7ed', 100: '#ffedd5', 500: '#f97316', 600: '#ea580c',
                },
            },
            boxShadow: {
                card: '0 1px 2px rgba(15,23,41,0.04), 0 4px 16px rgba(15,23,41,0.06)',
                'card-hover': '0 4px 8px rgba(15,23,41,0.06), 0 12px 32px rgba(15,23,41,0.10)',
                soft: '0 1px 0 rgba(15,23,41,0.04), 0 2px 8px rgba(15,23,41,0.05)',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                xl: '0.875rem',
                '2xl': '1.25rem',
            },
        },
    },
    plugins: [],
};
