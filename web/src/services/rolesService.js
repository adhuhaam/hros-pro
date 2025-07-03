const API_BASE_URL = 'http://localhost:4000/api';

export const rolesService = {
    // Get all roles with permissions
    async getAllRoles() {
        try {
            const response = await fetch(`${API_BASE_URL}/roles`);
            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to fetch roles');
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    },

    // Get role by ID
    async getRoleById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/roles/${id}`);
            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to fetch role');
            }
        } catch (error) {
            console.error('Error fetching role:', error);
            throw error;
        }
    },

    // Create new role
    async createRole(roleData) {
        try {
            const response = await fetch(`${API_BASE_URL}/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roleData),
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to create role');
            }
        } catch (error) {
            console.error('Error creating role:', error);
            throw error;
        }
    },

    // Update role
    async updateRole(id, roleData) {
        try {
            const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roleData),
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to update role');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            throw error;
        }
    },

    // Delete role
    async deleteRole(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to delete role');
            }
        } catch (error) {
            console.error('Error deleting role:', error);
            throw error;
        }
    },

    // Get all permissions
    async getAllPermissions() {
        try {
            const response = await fetch(`${API_BASE_URL}/roles/permissions/all`);
            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to fetch permissions');
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw error;
        }
    },

    // Create new permission
    async createPermission(permissionData) {
        try {
            const response = await fetch(`${API_BASE_URL}/roles/permissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(permissionData),
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to create permission');
            }
        } catch (error) {
            console.error('Error creating permission:', error);
            throw error;
        }
    },

    // Assign role to user
    async assignRoleToUser(roleId, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/roles/${roleId}/assign-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to assign role to user');
            }
        } catch (error) {
            console.error('Error assigning role to user:', error);
            throw error;
        }
    },

    // Remove role from user
    async removeRoleFromUser(roleId, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/roles/${roleId}/remove-user`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to remove role from user');
            }
        } catch (error) {
            console.error('Error removing role from user:', error);
            throw error;
        }
    }
};
