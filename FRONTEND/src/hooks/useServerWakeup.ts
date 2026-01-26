import { useState, useEffect } from 'react';
import { message } from '../components/common/AntdStaticProvider';
import healthCheckService from '../services/api/healthCheck.service';

interface UseServerWakeupReturn {
    isLoading: boolean;
    isConnected: boolean;
    error: string | null;
}

/**
 * Custom hook to handle server wake-up on component mount
 * Displays Ant Design messages for loading, success, and error states
 * Allows users to explore frontend while server is waking up
 */
export const useServerWakeup = (): UseServerWakeupReturn => {
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const wakeUpServer = async () => {
            // Show loading message
            const hideLoading = message.loading('Connecting to server...', 0);

            try {
                // Call health check endpoint to wake up server
                const response = await healthCheckService.checkHealth();

                if (response.status === 'ok') {
                    setIsConnected(true);
                    setError(null);

                    // Hide loading and show success
                    hideLoading();
                    message.success('Server is ready! 🚀', 2);
                }
            } catch (err) {
                setIsConnected(false);
                setError(err instanceof Error ? err.message : 'Failed to connect to server');

                // Hide loading and show error
                hideLoading();
                message.error(
                    'Server connection failed. You can still explore the frontend, but some features may not work.',
                    4
                );
            } finally {
                setIsLoading(false);
            }
        };

        wakeUpServer();
    }, []);

    return { isLoading, isConnected, error };
};
