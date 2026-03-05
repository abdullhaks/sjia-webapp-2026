/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_REACT_APP_SOCKET_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// Swiper CSS module declarations
declare module 'swiper/css' {
    const content: string;
    export default content;
}

declare module 'swiper/css/navigation' {
    const content: string;
    export default content;
}

declare module 'swiper/css/pagination' {
    const content: string;
    export default content;
}
