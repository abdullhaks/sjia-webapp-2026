import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { notification, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

const PWAInstallerPrompt: React.FC = () => {
    const { isAuthenticated } = useAuthStore();
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // Check when authentication status changes, or when we receive the deferredPrompt
    useEffect(() => {
        let isMounted = true;

        if (isAuthenticated && deferredPrompt) {
            const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
            if (!hasDismissed && isMounted) {
                const key = 'pwa-install-notification';
                notification.info({
                    key,
                    message: 'Install SJIA App',
                    description: 'Install the Sheikh Jeelani Islamic Academy app on your device for a better and faster experience.',
                    icon: <DownloadOutlined style={{ color: '#9B59B6' }} />,
                    duration: 0, // Don't auto-close
                    placement: 'bottomRight',
                    btn: (
                        <div className="flex gap-2 mt-2">
                            <Button size="small" onClick={() => {
                                localStorage.setItem('pwa_prompt_dismissed', 'true');
                                notification.destroy(key);
                            }}>
                                Later
                            </Button>
                            <Button type="primary" size="small" style={{ backgroundColor: '#9B59B6' }} onClick={async () => {
                                deferredPrompt.prompt();
                                const { outcome } = await deferredPrompt.userChoice;
                                if (outcome === 'accepted') {
                                    localStorage.setItem('pwa_prompt_dismissed', 'true');
                                }
                                notification.destroy(key);
                                setDeferredPrompt(null);
                            }}>
                                Install Now
                            </Button>
                        </div>
                    ),
                    onClose: () => {
                        localStorage.setItem('pwa_prompt_dismissed', 'true');
                    }
                });
            }
        }

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated, deferredPrompt]);

    // Renders nothing directly; uses Ant Design's imperative notification API
    return null;
};

export default PWAInstallerPrompt;
