import healthAxios from '../axios/healthAxios';

export interface HealthCheckResponse {
    status: string;
    message: string;
    timestamp: string;
    uptime?: number;
}

/**
 * Health Check Service
 * Handles server wake-up and health status checks
 */
class HealthCheckService {
    /**
     * Check if the server is running
     * This endpoint is used to wake up idle servers (e.g., on Render)
     */
    async checkHealth(): Promise<HealthCheckResponse> {
        try {
            const response = await healthAxios.get<HealthCheckResponse>('/health');
            return response.data;
        } catch (error) {
            throw new Error('Failed to connect to server');
        }
    }

    /**
     * Quick ping to check server status
     */
    async ping(): Promise<HealthCheckResponse> {
        try {
            const response = await healthAxios.get<HealthCheckResponse>('/health/ping');
            return response.data;
        } catch (error) {
            throw new Error('Server ping failed');
        }
    }
}

export default new HealthCheckService();
