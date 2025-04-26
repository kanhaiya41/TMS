import { useState } from 'react';
import mockPasswordRequests from '../data/mockPasswordRequests';
import { useSelector } from 'react-redux';

function UserProfile() {

  const { user } = useSelector(store => store.user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateProfileForm()) {
      // In a real app, this would save to the server
      alert('Profile updated successfully!');
      setIsEditing(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      // In a real app, this would submit a password request

      // Create new password request
      const newRequest = {
        id: mockPasswordRequests.length + 1,
        userId: user?.id,
        reason: 'User initiated password change',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resolvedBy: null,
        resolvedAt: null
      };

      // In a real app, this would be added to the database
      alert('Password update request submitted successfully!');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name,
      email: user?.email
    });
    setErrors({});
  };

  const cancelPasswordChange = () => {
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="animate-fade">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User Profile</h2>
        {!isEditing && !showPasswordForm && (
          <div className="flex gap-2">
            <button
              className="btn btn-outline"
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-2 gap-4">
        {/* Profile Information */}
        <div className="card">
          {isEditing ? (
            <div className="card-body">
              <h3 className="mb-3">Edit Profile</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control ${errors.name ? 'border-error' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="text-error text-sm mt-1">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? 'border-error' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
                </div>

                <div className="flex gap-2 justify-end mt-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : showPasswordForm ? (
            <div className="card-body">
              <h3 className="mb-3">Change Password</h3>
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className={`form-control ${errors.currentPassword ? 'border-error' : ''}`}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.currentPassword && (
                    <div className="text-error text-sm mt-1">{errors.currentPassword}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className={`form-control ${errors.newPassword ? 'border-error' : ''}`}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.newPassword && (
                    <div className="text-error text-sm mt-1">{errors.newPassword}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? 'border-error' : ''}`}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.confirmPassword && (
                    <div className="text-error text-sm mt-1">{errors.confirmPassword}</div>
                  )}
                </div>

                <div className="text-sm text-muted mt-2 mb-4">
                  <p>Password change will be processed according to your role:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Executives: Approved by Team Leaders</li>
                    <li>Team Leaders & Managers: Approved by Admins</li>
                    <li>Admins: Approved by Super Admins</li>
                  </ul>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={cancelPasswordChange}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card-body">
              <div className="flex items-center justify-center mb-4">

                <img
                  className="user-avatar" style={{
                    width: '80px',
                    height: '80px',
                    fontSize: '2rem',
                    backgroundColor: 'var(--color-primary)' }}
                  src={ user?.profile} alt="" />

              </div>

              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{user?.username} { user?.name ? <>({user?.name})</>:''}</h3>
                {/* {
                  user?.name!=="" && <p className="text-muted">{user?.name}</p>
                } */}
                <p className="text-muted">{user?.email}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-2 gap-3">
                  <div>
                    <p className="text-sm text-muted">Role</p>
                    <p className="font-medium">
                      {user?.designation?.charAt(0).toUpperCase() + user?.designation?.slice(1)}
                    </p>
                  </div>
                  {user?.department && (
                    <div>
                      <p className="text-sm text-muted">Department</p>
                      <p className="font-medium">{user?.department}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted">Joined Date</p>
                    <p className="font-medium">{formatDate(user?.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Address</p>
                    <p className="font-medium">
                      {user?.address}
                    </p>
                  </div>
                  {user?.branch && (
                    <div>
                      <p className="text-sm text-muted">Branch</p>
                      <p className="font-medium">{user?.branch}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted">Mobile Number</p>
                    <p className="font-medium">{user?.mobile}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="card">
          <div className="card-header">
            <h3>Activity Summary</h3>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Your Role Permissions</h4>
              <ul className="list-disc pl-5">
                {user?.designation === 'Executive' && (
                  <>
                    <li>Create and view your own tickets</li>
                    <li>Request password changes</li>
                    <li>Update your profile information</li>
                  </>
                )}
                {user?.designation === 'Manager' && (
                  <>
                    <li>View all executives in your department</li>
                    <li>View all tickets in your department</li>
                    <li>View password update requests by executives</li>
                    <li>Access department analytics and reports</li>
                  </>
                )}
                {user?.designation === 'Team Leader' && (
                  <>
                    <li>Create, edit, and delete executives</li>
                    <li>Manage tickets in your department</li>
                    <li>Approve password change requests</li>
                    <li>Assign tickets to team members</li>
                  </>
                )}
                {user?.designation === 'admin' && (
                  <>
                    <li>Create team leaders and managers</li>
                    <li>Manage departments in your branch</li>
                    <li>Full access to all tickets in your branch</li>
                    <li>Approve password requests for team leaders and managers</li>
                  </>
                )}
                {user?.designation === 'superadmin' && (
                  <>
                    <li>Create and manage all branches</li>
                    <li>Create and manage admin accounts</li>
                    <li>Full system access and override capabilities</li>
                    <li>System-wide configuration and settings</li>
                  </>
                )}
              </ul>
            </div>

            {/* <div>
              <h4 className="text-md font-medium mb-2">Recent Activity</h4>
              <div className="space-y-3">
                <div className="p-2 bg-gray-100 rounded">
                  <p className="text-sm">Logged in from new device</p>
                  <p className="text-xs text-muted">Today, 10:45 AM</p>
                </div>
                <div className="p-2 bg-gray-100 rounded">
                  <p className="text-sm">Profile information updated</p>
                  <p className="text-xs text-muted">Yesterday, 3:20 PM</p>
                </div>
                <div className="p-2 bg-gray-100 rounded">
                  <p className="text-sm">Password changed</p>
                  <p className="text-xs text-muted">Apr 15, 2023</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;