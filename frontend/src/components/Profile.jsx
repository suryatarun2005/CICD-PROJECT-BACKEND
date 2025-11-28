import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import { userAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await userAPI.getProfile();
      setEditedProfile({
        ...profile,
        insurance: {
          provider: profile.insuranceProvider || '',
          planName: profile.insurancePlanName || '',
          memberId: profile.insuranceMemberId || '',
          groupNumber: profile.insuranceGroupNumber || ''
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const saveProfile = async () => {
      try {
        const profileData = {
          ...editedProfile,
          insuranceProvider: editedProfile.insurance?.provider,
          insurancePlanName: editedProfile.insurance?.planName,
          insuranceMemberId: editedProfile.insurance?.memberId,
          insuranceGroupNumber: editedProfile.insurance?.groupNumber
        };
        delete profileData.insurance;
        
        await userAPI.updateProfile(profileData);
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    };
    
    saveProfile();
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.firstName || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.firstName || 'Not set'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.lastName || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.lastName || 'Not set'}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedProfile.dateOfBirth || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, dateOfBirth: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.dateOfBirth ? new Date(editedProfile.dateOfBirth).toLocaleDateString() : 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.email || 'Not set'}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.phone || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-gray-900">Address</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.address || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.address || 'Not set'}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.city || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, city: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.city || 'Not set'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.state || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, state: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.state || 'Not set'}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.zipCode || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, zipCode: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.zipCode || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Phone className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-gray-900">Emergency Contact</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.emergencyContactName || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, emergencyContactName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.emergencyContactName || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.emergencyContactPhone || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, emergencyContactPhone: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.emergencyContactPhone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.emergencyContactRelation || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, emergencyContactRelation: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.emergencyContactRelation || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Insurance Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-gray-900">Insurance Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.insurance?.provider || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile, 
                    insurance: {...editedProfile.insurance, provider: e.target.value}
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.insurance?.provider || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.insurance?.planName || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile, 
                    insurance: {...editedProfile.insurance, planName: e.target.value}
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.insurance?.planName || 'Not set'}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.insurance?.memberId || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile, 
                      insurance: {...editedProfile.insurance, memberId: e.target.value}
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.insurance?.memberId || 'Not set'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.insurance?.groupNumber || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile, 
                      insurance: {...editedProfile.insurance, groupNumber: e.target.value}
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.insurance?.groupNumber || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};