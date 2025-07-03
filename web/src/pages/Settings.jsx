import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Cog6ToothIcon, 
  UserGroupIcon, 
  ShieldCheckIcon, 
  SwatchIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { settingsService } from '../services/settingsService';
import { rolesService } from '../services/rolesService';

function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('general');

  // Read section from URL parameters
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && ['general', 'roles', 'access', 'theme'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'general') {
      setSearchParams({});
    } else {
      setSearchParams({ section: sectionId });
    }
  };

  const settingsSections = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic system configuration and preferences',
      icon: <Cog6ToothIcon className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'roles',
      title: 'Roles Management',
      description: 'Create and manage user roles and permissions',
      icon: <UserGroupIcon className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'access',
      title: 'Access Control',
      description: 'Configure role-based access and user permissions',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'theme',
      title: 'Theme Settings',
      description: 'Customize colors, themes, and visual preferences',
      icon: <SwatchIcon className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />;
      case 'roles':
        return <RolesSettings />;
      case 'access':
        return <AccessControlSettings />;
      case 'theme':
        return <ThemeSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">Settings</h1>
        <p className="text-base-content/70">Manage system configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-base-200/50 rounded-xl p-4 backdrop-blur-sm border border-base-300">
            <h2 className="text-lg font-semibold mb-4 text-base-content">Settings Categories</h2>
            <div className="space-y-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`w-full p-4 rounded-lg transition-all duration-200 text-left group ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r ' + section.color + ' text-white shadow-lg'
                      : 'hover:bg-base-300/80 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activeSection === section.id 
                          ? 'bg-white/20' 
                          : 'bg-gradient-to-r ' + section.color + ' text-white'
                      }`}>
                        {section.icon}
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          activeSection === section.id ? 'text-white' : 'text-base-content'
                        }`}>
                          {section.title}
                        </h3>
                        <p className={`text-sm ${
                          activeSection === section.id ? 'text-white/80' : 'text-base-content/60'
                        }`}>
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRightIcon className={`w-5 h-5 transition-transform duration-200 ${
                      activeSection === section.id ? 'text-white' : 'text-base-content/40'
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-base-200/50 rounded-xl p-6 backdrop-blur-sm border border-base-300">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// General Settings Component
function GeneralSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadGeneralSettings();
  }, []);

  const loadGeneralSettings = async () => {
    try {
      setLoading(true);
      const generalSettings = await settingsService.getSettingsByCategory('general');
      const settingsMap = {};
      generalSettings.forEach(setting => {
        settingsMap[setting.key] = setting;
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');

      const settingsToUpdate = Object.values(settings).map(setting => ({
        key: setting.key,
        value: setting.value,
        description: setting.description
      }));

      await settingsService.updateMultipleSettings(settingsToUpdate);
      setMessage('Settings saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      await loadGeneralSettings();
      setMessage('Settings reset to default values');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-base-content">General Settings</h2>
      
      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} mb-6`}>
          <span>{message}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Company Name</span>
          </label>
          <input 
            type="text" 
            className="input input-bordered w-full" 
            placeholder="Enter company name"
            value={settings.company_name?.value || ''}
            onChange={(e) => handleInputChange('company_name', e.target.value)}
          />
          {settings.company_name?.description && (
            <label className="label">
              <span className="label-text-alt text-base-content/60">{settings.company_name.description}</span>
            </label>
          )}
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">System Email</span>
          </label>
          <input 
            type="email" 
            className="input input-bordered w-full" 
            placeholder="admin@company.com"
            value={settings.system_email?.value || ''}
            onChange={(e) => handleInputChange('system_email', e.target.value)}
          />
          {settings.system_email?.description && (
            <label className="label">
              <span className="label-text-alt text-base-content/60">{settings.system_email.description}</span>
            </label>
          )}
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Time Zone</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={settings.timezone?.value || 'UTC'}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
          >
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="EST">EST (Eastern Standard Time)</option>
            <option value="PST">PST (Pacific Standard Time)</option>
            <option value="GMT">GMT (Greenwich Mean Time)</option>
          </select>
          {settings.timezone?.description && (
            <label className="label">
              <span className="label-text-alt text-base-content/60">{settings.timezone.description}</span>
            </label>
          )}
        </div>
        
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text font-medium">Enable Notifications</span>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={settings.notifications_enabled?.value === 'true'}
              onChange={(e) => handleInputChange('notifications_enabled', e.target.checked.toString())}
            />
          </label>
          {settings.notifications_enabled?.description && (
            <label className="label">
              <span className="label-text-alt text-base-content/60">{settings.notifications_enabled.description}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text font-medium">Maintenance Mode</span>
            <input 
              type="checkbox" 
              className="toggle toggle-warning" 
              checked={settings.maintenance_mode?.value === 'true'}
              onChange={(e) => handleInputChange('maintenance_mode', e.target.checked.toString())}
            />
          </label>
          {settings.maintenance_mode?.description && (
            <label className="label">
              <span className="label-text-alt text-base-content/60">{settings.maintenance_mode.description}</span>
            </label>
          )}
        </div>

        {settings.system_version && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">System Version</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full bg-base-200" 
              value={settings.system_version.value}
              disabled
            />
            {settings.system_version.description && (
              <label className="label">
                <span className="label-text-alt text-base-content/60">{settings.system_version.description}</span>
              </label>
            )}
          </div>
        )}
        
        <div className="flex gap-3">
          <button 
            className={`btn btn-primary ${saving ? 'loading' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            className="btn btn-ghost"
            onClick={handleReset}
            disabled={saving}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}

// Roles Settings Component
function RolesSettings() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    loadRolesAndPermissions();
  }, []);

  const loadRolesAndPermissions = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData] = await Promise.all([
        rolesService.getAllRoles(),
        rolesService.getAllPermissions()
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData.permissions || []);
    } catch (error) {
      console.error('Error loading roles and permissions:', error);
      setMessage('Failed to load roles and permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setFormData({ name: '', description: '', permissions: [] });
    setShowCreateModal(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions?.map(p => p.name) || []
    });
    setShowEditModal(true);
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      try {
        await rolesService.deleteRole(roleId);
        setMessage('Role deleted successfully!');
        loadRolesAndPermissions();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting role:', error);
        setMessage('Failed to delete role');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showEditModal) {
        await rolesService.updateRole(selectedRole.id, formData);
        setMessage('Role updated successfully!');
      } else {
        await rolesService.createRole(formData);
        setMessage('Role created successfully!');
      }
      
      setShowCreateModal(false);
      setShowEditModal(false);
      loadRolesAndPermissions();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving role:', error);
      setMessage('Failed to save role');
    }
  };

  const handlePermissionChange = (permissionName, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionName]
        : prev.permissions.filter(p => p !== permissionName)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-base-content">Roles Management</h2>
        <button className="btn btn-primary" onClick={handleCreateRole}>
          <span className="text-lg">+</span>
          Add New Role
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} mb-6`}>
          <span>{message}</span>
        </div>
      )}
      
      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-base-100 rounded-lg p-4 border border-base-300 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-focus rounded-lg flex items-center justify-center text-white font-bold">
                  {role.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">{role.name}</h3>
                  <p className="text-sm text-base-content/70">{role.description}</p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs text-base-content/60">{role.userCount || 0} users</span>
                    <span className="text-xs text-base-content/60">{role.permissions?.length || 0} permissions</span>
                  </div>
                  {role.permissions && role.permissions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {role.permissions.slice(0, 3).map((permission, index) => (
                        <span key={index} className="badge badge-primary badge-xs">
                          {permission.name}
                        </span>
                      ))}
                      {role.permissions.length > 3 && (
                        <span className="badge badge-ghost badge-xs">
                          +{role.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleEditRole(role)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-sm btn-error btn-outline"
                  onClick={() => handleDeleteRole(role.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <RoleModal
          title="Create New Role"
          formData={formData}
          setFormData={setFormData}
          permissions={permissions}
          onSubmit={handleSubmit}
          onClose={() => setShowCreateModal(false)}
          handlePermissionChange={handlePermissionChange}
        />
      )}

      {/* Edit Role Modal */}
      {showEditModal && (
        <RoleModal
          title="Edit Role"
          formData={formData}
          setFormData={setFormData}
          permissions={permissions}
          onSubmit={handleSubmit}
          onClose={() => setShowEditModal(false)}
          handlePermissionChange={handlePermissionChange}
        />
      )}
    </div>
  );
}

// Access Control Settings Component
function AccessControlSettings() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    resource: '',
    action: ''
  });

  useEffect(() => {
    loadAccessControlData();
  }, []);

  const loadAccessControlData = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData] = await Promise.all([
        rolesService.getAllRoles(),
        rolesService.getAllPermissions()
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData.permissions || []);
    } catch (error) {
      console.error('Error loading access control data:', error);
      setMessage('Failed to load access control data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePermission = () => {
    setFormData({ name: '', description: '', resource: '', action: '' });
    setShowPermissionModal(true);
  };

  const handleEditPermission = (permission) => {
    setSelectedPermission(permission);
    setFormData({
      name: permission.name,
      description: permission.description || '',
      resource: permission.resource,
      action: permission.action
    });
    setShowPermissionModal(true);
  };

  const handleSubmitPermission = async (e) => {
    e.preventDefault();
    try {
      if (selectedPermission) {
        // Note: Update permission endpoint would need to be added to the backend
        setMessage('Permission update not implemented yet');
      } else {
        await rolesService.createPermission(formData);
        setMessage('Permission created successfully!');
      }
      
      setShowPermissionModal(false);
      loadAccessControlData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving permission:', error);
      setMessage('Failed to save permission');
    }
  };

  const getRolesWithPermission = (permissionName) => {
    return roles.filter(role => 
      role.permissions?.some(p => p.name === permissionName)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-base-content">Access Control</h2>
        <button className="btn btn-primary" onClick={handleCreatePermission}>
          <span className="text-lg">+</span>
          Add Permission
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} mb-6`}>
          <span>{message}</span>
        </div>
      )}

      <div className="space-y-4">
        {permissions.map((permission) => {
          const rolesWithPermission = getRolesWithPermission(permission.name);
          return (
            <div key={permission.id} className="bg-base-100 rounded-lg p-4 border border-base-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-base-content">{permission.name}</h3>
                    <span className="badge badge-outline badge-sm">
                      {permission.resource} - {permission.action}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 mb-2">{permission.description}</p>
                  <div className="flex gap-2">
                    {rolesWithPermission.map((role, index) => (
                      <span key={index} className="badge badge-primary badge-sm">{role.name}</span>
                    ))}
                    {rolesWithPermission.length === 0 && (
                      <span className="text-xs text-base-content/50">No roles assigned</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="btn btn-sm btn-ghost"
                    onClick={() => handleEditPermission(permission)}
                  >
                    Edit
                  </button>
                  <button className="btn btn-sm btn-ghost">Configure</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <PermissionModal
          title={selectedPermission ? 'Edit Permission' : 'Create Permission'}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitPermission}
          onClose={() => setShowPermissionModal(false)}
        />
      )}
    </div>
  );
}

// Theme Settings Component
function ThemeSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const themes = [
    { id: 'default', name: 'Default', description: 'Clean and professional' },
    { id: 'dark', name: 'Dark Mode', description: 'Easy on the eyes' },
    { id: 'light', name: 'Light Mode', description: 'Bright and clear' },
    { id: 'auto', name: 'Auto', description: 'Follows system preference' }
  ];

  const colors = [
    { id: 'blue', name: 'Blue', class: 'bg-blue-500' },
    { id: 'green', name: 'Green', class: 'bg-green-500' },
    { id: 'purple', name: 'Purple', class: 'bg-purple-500' },
    { id: 'orange', name: 'Orange', class: 'bg-orange-500' },
    { id: 'red', name: 'Red', class: 'bg-red-500' },
    { id: 'pink', name: 'Pink', class: 'bg-pink-500' }
  ];

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      setLoading(true);
      const themeSettings = await settingsService.getSettingsByCategory('theme');
      const settingsMap = {};
      themeSettings.forEach(setting => {
        settingsMap[setting.key] = setting;
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading theme settings:', error);
      setMessage('Failed to load theme settings');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (themeId) => {
    try {
      await settingsService.updateSetting('theme_mode', themeId);
      setSettings(prev => ({
        ...prev,
        theme_mode: {
          ...prev.theme_mode,
          value: themeId
        }
      }));
      setMessage('Theme updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating theme:', error);
      setMessage('Failed to update theme');
    }
  };

  const handleColorChange = async (colorId) => {
    try {
      await settingsService.updateSetting('primary_color', colorId);
      setSettings(prev => ({
        ...prev,
        primary_color: {
          ...prev.primary_color,
          value: colorId
        }
      }));
      setMessage('Color updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating color:', error);
      setMessage('Failed to update color');
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setMessage('');

      const settingsToUpdate = Object.values(settings).map(setting => ({
        key: setting.key,
        value: setting.value,
        description: setting.description
      }));

      await settingsService.updateMultipleSettings(settingsToUpdate);
      setMessage('Theme settings saved successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving theme settings:', error);
      setMessage('Failed to save theme settings');
    } finally {
      setSaving(false);
    }
  };

  const selectedTheme = settings.theme_mode?.value || 'default';
  const selectedColor = settings.primary_color?.value || 'blue';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-base-content">Theme Settings</h2>
      
      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} mb-6`}>
          <span>{message}</span>
        </div>
      )}
      
      <div className="space-y-8">
        {/* Theme Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-base-content">Theme Mode</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedTheme === theme.id
                    ? 'border-primary bg-primary/10'
                    : 'border-base-300 hover:border-primary/50'
                }`}
              >
                <h4 className="font-medium text-base-content">{theme.name}</h4>
                <p className="text-sm text-base-content/70">{theme.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-base-content">Primary Color</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorChange(color.id)}
                className={`w-16 h-16 rounded-lg border-4 transition-all duration-200 ${
                  color.class
                } ${
                  selectedColor === color.id
                    ? 'border-base-content shadow-lg scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-base-content">Preview</h3>
          <div className="bg-base-100 rounded-lg p-6 border border-base-300">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 ${colors.find(c => c.id === selectedColor)?.class} rounded-lg flex items-center justify-center text-white font-bold`}>
                H
              </div>
              <div>
                <h4 className="font-semibold text-base-content">HRMS Pro</h4>
                <p className="text-sm text-base-content/70">Theme: {themes.find(t => t.id === selectedTheme)?.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary">Primary Button</button>
              <button className="btn btn-ghost">Secondary Button</button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            className={`btn btn-primary ${saving ? 'loading' : ''}`}
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Apply Theme'}
          </button>
          <button 
            className="btn btn-ghost"
            onClick={loadThemeSettings}
            disabled={saving}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}

// Permission Modal Component
function PermissionModal({ title, formData, setFormData, onSubmit, onClose }) {
  const resources = ['users', 'roles', 'employees', 'payroll', 'recruitment', 'attendance', 'leaves', 'settings'];
  const actions = ['create', 'read', 'update', 'delete', 'manage'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-base-content">{title}</h3>
          <button 
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Permission Name</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full" 
              placeholder="e.g., manage_users"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea 
              className="textarea textarea-bordered w-full" 
              placeholder="Enter permission description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Resource</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={formData.resource}
              onChange={(e) => setFormData(prev => ({ ...prev, resource: e.target.value }))}
              required
            >
              <option value="">Select resource</option>
              {resources.map(resource => (
                <option key={resource} value={resource}>{resource}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Action</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={formData.action}
              onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
              required
            >
              <option value="">Select action</option>
              {actions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end">
            <button 
              type="button" 
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {title.includes('Create') ? 'Create Permission' : 'Update Permission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Role Modal Component
function RoleModal({ title, formData, setFormData, permissions, onSubmit, onClose, handlePermissionChange }) {
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-base-content">{title}</h3>
          <button 
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Role Name</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full" 
              placeholder="Enter role name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea 
              className="textarea textarea-bordered w-full" 
              placeholder="Enter role description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Permissions</span>
            </label>
            <div className="space-y-4 max-h-64 overflow-y-auto border border-base-300 rounded-lg p-4">
              {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                <div key={resource} className="space-y-2">
                  <h4 className="font-semibold text-base-content capitalize">{resource}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {resourcePermissions.map((permission) => (
                      <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="checkbox checkbox-sm checkbox-primary"
                          checked={formData.permissions.includes(permission.name)}
                          onChange={(e) => handlePermissionChange(permission.name, e.target.checked)}
                        />
                        <span className="text-sm text-base-content">
                          {permission.action} {permission.resource}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button 
              type="button" 
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {title.includes('Create') ? 'Create Role' : 'Update Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
