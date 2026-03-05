import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App as AntdApp } from 'antd'
// import '@ant-design/v5-patch-for-react-19';
import AntdStaticProvider from './components/common/AntdStaticProvider'
import AppRoot from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { useThemeStore } from './store/themeStore'
import { theme as antdTheme } from 'antd'

// Third-party CSS imports (must be before index.css)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// App styles (after third-party CSS)
import './index.css'

// Register PWA Service Worker
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        console.log('App ready to work offline');
    }
});

// A wrapper to consume the theme store and provide it to ConfigProvider
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                token: {
                    colorPrimary: '#059669', // Emerald 600
                    colorInfo: '#14b8a6', // Teal 500
                    colorSuccess: '#10b981', // Emerald 500
                    colorWarning: '#F39C12', // Orange/Accent
                    colorError: '#EF4444', // Red
                    borderRadius: 8,
                    fontFamily: "'Inter', 'Poppins', system-ui, sans-serif",
                },
                components: {
                    Card: {
                        colorBgContainer: isDark ? '#1e293b' : '#ffffff',
                        colorBorder: isDark ? '#334155' : '#e2e8f0',
                    },
                    Table: {
                        colorBgContainer: isDark ? '#1e293b' : '#ffffff',
                        colorBorder: isDark ? '#334155' : '#e2e8f0',
                        colorTextHeading: isDark ? '#e2e8f0' : '#1e293b',
                    },
                    Modal: {
                        colorBgElevated: isDark ? '#1e293b' : '#ffffff',
                    }
                }
            }}
        >
            <AntdApp>
                <AntdStaticProvider />
                {children}
            </AntdApp>
        </ConfigProvider>
    );
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeWrapper>
            <AppRoot />
        </ThemeWrapper>
    </StrictMode>,
)
