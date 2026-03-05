import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Modal, Button } from 'antd';
import { DownloadOutlined, CloseCircleFilled } from '@ant-design/icons';

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
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Optionally, we could show the modal right here if they are already logged in
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // Check when authentication status changes, or when we receive the deferredPrompt
    useEffect(() => {
        if (isAuthenticated && deferredPrompt) {
            // Check if we should show the prompt (maybe they dismissed it before? We could use localStorage)
            const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
            if (!hasDismissed) {
                setIsModalVisible(true);
            }
        } else {
            setIsModalVisible(false);
        }
    }, [isAuthenticated, deferredPrompt]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsModalVisible(false);
    };

    const handleDismissClick = () => {
        localStorage.setItem('pwa_prompt_dismissed', 'true');
        setIsModalVisible(false);
    };

    return (
        <Modal
            title={<div className="text-xl font-bold flex items-center gap-2"><DownloadOutlined /> Install SJIA App</div>}
            open={isModalVisible}
            onCancel={handleDismissClick}
            footer={null}
            closeIcon={<CloseCircleFilled className="text-gray-400 hover:text-gray-600 text-xl" />}
            centered
            className="pwa-installer-modal"
        >
            <div className="flex justify-center my-6">
                <img src="/pwa-192x192.png" alt="SJIA Logo" className="w-24 h-24 rounded-2xl shadow-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <p className="text-center text-gray-600 mb-6 text-lg">
                For a better and faster experience, install the Sheikh Jeelani Islamic Academy app on your device.
            </p>
            <div className="flex gap-4 justify-center">
                <Button size="large" onClick={handleDismissClick} className="w-1/3">
                    Later
                </Button>
                <Button type="primary" size="large" onClick={handleInstallClick} className="w-2/3 bg-purple-600 hover:bg-purple-700">
                    Install Now
                </Button>
            </div>
        </Modal>
    );
};

export default PWAInstallerPrompt;
