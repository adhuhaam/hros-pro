const API_BASE_URL = 'http://localhost:3000/api';

export const settingsService = {
    // Get all settings
    async getAllSettings() {
        try {
            const response = await fetch(`${API_BASE_URL}/settings`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch settings');
            }

            return data.data;
        } catch (error) {
            console.error('Error fetching settings:', error);
            throw error;
        }
    },

    // Get settings by category
    async getSettingsByCategory(category) {
        try {
            const response = await fetch(`${API_BASE_URL}/settings/category/${category}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch settings');
            }

            return data.data;
        } catch (error) {
            console.error('Error fetching settings by category:', error);
            throw error;
        }
    },

    // Get setting by key
    async getSettingByKey(key) {
        try {
            const response = await fetch(`${API_BASE_URL}/settings/${key}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch setting');
            }

            return data.data;
        } catch (error) {
            console.error('Error fetching setting:', error);
            throw error;
        }
    },

    // Update setting
    async updateSetting(key, value, description = null) {
        try {
            const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value, description }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to update setting');
            }

            return data.data;
        } catch (error) {
            console.error('Error updating setting:', error);
            throw error;
        }
    },

    // Update multiple settings
    async updateMultipleSettings(settings) {
        try {
            const response = await fetch(`${API_BASE_URL}/settings/batch/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ settings }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to update settings');
            }

            return data.data;
        } catch (error) {
            console.error('Error updating multiple settings:', error);
            throw error;
        }
    },

    // Create new setting
    async createSetting(settingData) {
        try {
            const response = await fetch(`${API_BASE_URL}/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settingData),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to create setting');
            }

            return data.data;
        } catch (error) {
            console.error('Error creating setting:', error);
            throw error;
        }
    },

    // Delete setting
    async deleteSetting(key) {
        try {
            const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to delete setting');
            }

            return data;
        } catch (error) {
            console.error('Error deleting setting:', error);
            throw error;
        }
    }
}; 