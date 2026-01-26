import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App } from 'antd'
// import '@ant-design/v5-patch-for-react-19';
import AntdStaticProvider from './components/common/AntdStaticProvider'
import AppRoot from './App.tsx'

// Third-party CSS imports (must be before index.css)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// App styles (after third-party CSS)
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#9B59B6',
                    borderRadius: 8,
                },
            }}
        >
            <App>
                <AntdStaticProvider />
                <AppRoot />
            </App>
        </ConfigProvider>
    </StrictMode>,
)
