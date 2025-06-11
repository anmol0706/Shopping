import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  Lock,
  Heart,
  ShoppingBag,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Camera,
  Bell,
  Globe,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword, isUpdateProfileLoading, isChangePasswordLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Personal info form
  const personalForm = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      gender: user?.gender || ''
    }
  });

  // Address form
  const addressForm = useForm({
    defaultValues: {
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false
    }
  });

  // Password form
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      personalForm.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || ''
      });
    }
  }, [user, personalForm]);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  const handlePersonalInfoSubmit = (data) => {
    updateProfile(data);
    setIsEditingPersonal(false);
  };

  const handleAddressSubmit = (data) => {
    const addresses = user?.addresses || [];

    if (editingAddressId) {
      // Update existing address
      const updatedAddresses = addresses.map(addr =>
        addr._id === editingAddressId ? { ...addr, ...data } : addr
      );
      updateProfile({ addresses: updatedAddresses });
    } else {
      // Add new address
      const newAddress = {
        ...data,
        _id: Date.now().toString() // Temporary ID
      };
      updateProfile({ addresses: [...addresses, newAddress] });
    }

    setIsEditingAddress(false);
    setEditingAddressId(null);
    addressForm.reset();
  };

  const handlePasswordSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });

    setShowPasswordForm(false);
    passwordForm.reset();
  };

  const deleteAddress = (addressId) => {
    const addresses = user?.addresses || [];
    const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
    updateProfile({ addresses: updatedAddresses });
  };

  const editAddress = (address) => {
    setEditingAddressId(address._id);
    addressForm.reset(address);
    setIsEditingAddress(true);
  };

  return (
    <>
      <Helmet>
        <title>Profile - ShopEase</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 md:py-8 mobile-content-padding">
        {/* Floating background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mobile-profile-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2 md:mb-4 mobile-heading">
              My Profile
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4 md:px-0">
              Manage your personal information, addresses, and account settings
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden"
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-4 md:p-8 border-b border-white/20 mobile-profile-header">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-7 h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors nav-touch-target">
                    <Camera className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>

                {/* User Info */}
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    {user?.name || 'User'}
                  </h2>
                  <p className="text-gray-600 mb-2 text-sm md:text-base">{user?.email}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium">
                      {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                    {user?.isEmailVerified && (
                      <span className="px-2 md:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs md:text-sm font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex space-x-4 md:space-x-6 text-center">
                  <div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">0</div>
                    <div className="text-xs md:text-sm text-gray-600">Orders</div>
                  </div>
                  <div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">{user?.wishlist?.length || 0}</div>
                    <div className="text-xs md:text-sm text-gray-600">Wishlist</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-4 md:space-x-8 px-3 md:px-8 mobile-profile-tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-1 md:space-x-2 py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm transition-colors nav-touch-target mobile-profile-tab ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:block whitespace-nowrap">{tab.label}</span>
                      <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 md:p-8 mobile-profile-content">
              <AnimatePresence mode="wait">
                {activeTab === 'personal' && (
                  <PersonalInfoTab
                    user={user}
                    form={personalForm}
                    isEditing={isEditingPersonal}
                    setIsEditing={setIsEditingPersonal}
                    onSubmit={handlePersonalInfoSubmit}
                    isLoading={isUpdateProfileLoading}
                  />
                )}

                {activeTab === 'addresses' && (
                  <AddressesTab
                    user={user}
                    form={addressForm}
                    isEditing={isEditingAddress}
                    setIsEditing={setIsEditingAddress}
                    editingId={editingAddressId}
                    setEditingId={setEditingAddressId}
                    onSubmit={handleAddressSubmit}
                    onEdit={editAddress}
                    onDelete={deleteAddress}
                    isLoading={isUpdateProfileLoading}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsTab user={user} updateProfile={updateProfile} />
                )}

                {activeTab === 'security' && (
                  <SecurityTab
                    form={passwordForm}
                    showPasswordForm={showPasswordForm}
                    setShowPasswordForm={setShowPasswordForm}
                    showCurrentPassword={showCurrentPassword}
                    setShowCurrentPassword={setShowCurrentPassword}
                    showNewPassword={showNewPassword}
                    setShowNewPassword={setShowNewPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    onSubmit={handlePasswordSubmit}
                    isLoading={isChangePasswordLoading}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

// Personal Info Tab Component
const PersonalInfoTab = ({ user, form, isEditing, setIsEditing, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <motion.div
      key="personal"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mobile-form-button nav-touch-target"
          >
            <Edit3 className="w-4 h-4" />
            <span className="text-sm md:text-base">Edit</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center justify-center space-x-2 px-3 md:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors mobile-form-button nav-touch-target"
            >
              <X className="w-4 h-4" />
              <span className="text-sm md:text-base">Cancel</span>
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 mobile-form-button nav-touch-target"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm md:text-base">{isLoading ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Name */}
        <div className="mobile-form-field">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('name', { required: 'Name is required' })}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 mobile-form-input"
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mobile-form-field">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              disabled={true} // Email should not be editable
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 mobile-form-input"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>

        {/* Phone */}
        <div className="mobile-form-field">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('phone')}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 mobile-form-input"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div className="mobile-form-field">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('dateOfBirth')}
              type="date"
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 mobile-form-input"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex space-x-4">
            {['male', 'female', 'other'].map((gender) => (
              <label key={gender} className="flex items-center">
                <input
                  {...register('gender')}
                  type="radio"
                  value={gender}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{gender}</span>
              </label>
            ))}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

// Addresses Tab Component
const AddressesTab = ({ user, form, isEditing, setIsEditing, editingId, setEditingId, onSubmit, onEdit, onDelete, isLoading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = form;
  const addresses = user?.addresses || [];

  const handleAddNew = () => {
    reset({
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    reset();
  };

  return (
    <motion.div
      key="addresses"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Addresses</h3>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {/* Address Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Type
              </label>
              <select
                {...register('type', { required: 'Address type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                {...register('country', { required: 'Country is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Country"
              />
            </div>

            {/* Street Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                {...register('street', { required: 'Street address is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address"
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                {...register('city', { required: 'City is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                {...register('state', { required: 'State is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="State"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                {...register('zipCode', { required: 'ZIP code is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ZIP Code"
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
              )}
            </div>

            {/* Default Address */}
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  {...register('isDefault')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Set as default address</span>
              </label>
            </div>
          </form>
        </motion.div>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No addresses added yet</p>
            <p className="text-sm text-gray-400">Add your first address to get started</p>
          </div>
        ) : (
          addresses.map((address) => (
            <motion.div
              key={address._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium">{address.street}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(address)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(address._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

// Settings Tab Component
const SettingsTab = ({ user, updateProfile }) => {
  const [preferences, setPreferences] = useState(user?.preferences || {
    newsletter: true,
    notifications: {
      email: true,
      sms: false
    },
    currency: 'INR',
    language: 'en'
  });

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences };
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      newPreferences[parent] = { ...newPreferences[parent], [child]: value };
    } else {
      newPreferences[key] = value;
    }
    setPreferences(newPreferences);
    updateProfile({ preferences: newPreferences });
  };

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-900">Account Settings</h3>

      {/* Notification Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notification Preferences
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive order updates and promotions via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications?.email || false}
                onChange={(e) => handlePreferenceChange('notifications.email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive order updates via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications?.sms || false}
                onChange={(e) => handlePreferenceChange('notifications.sms', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Newsletter</p>
              <p className="text-sm text-gray-600">Receive our weekly newsletter with deals and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.newsletter || false}
                onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Regional Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={preferences.currency || 'INR'}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={preferences.language || 'en'}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <span>View Orders</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5 text-gray-600" />
            <span>View Wishlist</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Security Tab Component
const SecurityTab = ({
  form,
  showPasswordForm,
  setShowPasswordForm,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onSubmit,
  isLoading
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = form;
  const newPassword = watch('newPassword');

  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>

      {/* Password Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Password
            </h4>
            <p className="text-sm text-gray-600">Keep your account secure with a strong password</p>
          </div>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          )}
        </div>

        {showPasswordForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    {...register('currentPassword', { required: 'Current password is required' })}
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type={showNewPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === newPassword || 'Passwords do not match'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Account Security Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Account Security</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">Password Protected</p>
                <p className="text-sm text-green-700">Your account is secured with a password</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Email Verified</p>
                <p className="text-sm text-blue-700">Your email address has been verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
