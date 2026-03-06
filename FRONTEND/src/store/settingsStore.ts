import { create } from 'zustand';
import axios from 'axios';

// Get API URL from environment variable or default to localhost
import { API_URL } from '../config/env';

export interface Setting {
    _id: string;
    key: string;
    value: string;
    type: string;
    description?: string;
}

interface SettingsStore {
    settings: Setting[];
    loading: boolean;
    error: string | null;

    // Derived state getters
    getSettingValue: <T>(key: string, defaultValue: T) => T;

    // Actions
    fetchSettings: () => Promise<void>;
    createOrUpdateSetting: (key: string, value: any, type?: string, description?: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    settings: [],
    loading: false,
    error: null,

    getSettingValue: <T>(key: string, defaultValue: T): T => {
        const setting = get().settings.find(s => s.key === key);
        if (!setting) return defaultValue;

        try {
            if (setting.type === 'json' || setting.type === 'array') {
                return JSON.parse(setting.value) as T;
            }
            if (setting.type === 'boolean') {
                return (setting.value === 'true') as unknown as T;
            }
            if (setting.type === 'number') {
                return Number(setting.value) as unknown as T;
            }
            return setting.value as unknown as T;
        } catch (e) {
            console.error(`Error parsing setting value for key: ${key}`, e);
            return defaultValue;
        }
    },

    fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ settings: response.data, loading: false });
        } catch (error: any) {
            console.error('Error fetching settings:', error);
            set({
                error: error.response?.data?.message || 'Failed to fetch settings',
                loading: false
            });
        }
    },

    createOrUpdateSetting: async (key, value, type = 'string', description) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');

            // Format value based on type
            let stringValue = value;
            if (typeof value === 'object') {
                stringValue = JSON.stringify(value);
                type = 'json';
            } else {
                stringValue = String(value);
            }

            await axios.post(
                `${API_URL}/settings`,
                { key, value: stringValue, type, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh settings after update
            await get().fetchSettings();
        } catch (error: any) {
            console.error('Error updating setting:', error);
            set({
                error: error.response?.data?.message || 'Failed to update setting',
                loading: false
            });
            throw error;
        }
    }
}));
