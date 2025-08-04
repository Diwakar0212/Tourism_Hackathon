import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Accessibility,
  Heart,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { User as UserType, EmergencyContact, AccessibilityNeeds } from '../types';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'safety' | 'accessibility' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState<UserType>({
    id: 'user1',
    email: 'priya.sharma@email.com',
    firstName: 'Priya',
    lastName: 'Sharma',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+91 98765 43210',
    emergencyContacts: [
      {
        id: 'ec1',
        name: 'Rajesh Sharma',
        phone: '+91 98765 43211',
        relationship: 'Father',
        isPrimary: true
      },
      {
        id: 'ec2',
        name: 'Meera Sharma',
        phone: '+91 98765 43212',
        relationship: 'Mother',
        isPrimary: false
      }
    ],
    accessibilityNeeds: {
      wheelchairAccessible: false,
      visualImpairment: false,
      hearingImpairment: false,
      mobilityAid: [],
      cognitiveSupport: false,
      languageSupport: ['English', 'Hindi']
    },
    preferences: {
      budget: 'mid-range',
      travelStyle: 'solo',
      interests: ['Culture & Heritage', 'Food & Cuisine', 'Photography'],
      dietaryRestrictions: ['Vegetarian'],
      preferredLanguage: 'English'
    },
    safetySettings: {
      shareLocationWithContacts: true,
      sosEnabled: true,
      safeRoutePreference: true,
      femaleOnlyServices: true,
      autoCheckIn: true,
      checkInInterval: 120
    },
    createdAt: new Date('2023-06-15'),
    lastLogin: new Date('2024-02-14')
  });

  const [editedUser, setEditedUser] = useState<UserType>(user);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: `ec${Date.now()}`,
      name: '',
      phone: '',
      relationship: '',
      isPrimary: false
    };
    setEditedUser(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact]
    }));
  };

  const removeEmergencyContact = (contactId: string) => {
    setEditedUser(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(c => c.id !== contactId)
    }));
  };

  const updateEmergencyContact = (contactId: string, field: keyof EmergencyContact, value: any) => {
    setEditedUser(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map(c =>
        c.id === contactId ? { ...c, [field]: value } : c
      )
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        <Button
          variant={isEditing ? "outline" : "ghost"}
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          icon={isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          {isEditing && (
            <button className="absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700">
              <Edit3 className="h-3 w-3" />
            </button>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">
            Member since {user.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={isEditing ? editedUser.firstName : user.firstName}
          onChange={(e) => setEditedUser(prev => ({ ...prev, firstName: e.target.value }))}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Last Name"
          value={isEditing ? editedUser.lastName : user.lastName}
          onChange={(e) => setEditedUser(prev => ({ ...prev, lastName: e.target.value }))}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Email"
          type="email"
          value={isEditing ? editedUser.email : user.email}
          onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
          disabled={!isEditing}
          icon={<Mail className="h-4 w-4" />}
          fullWidth
        />
        <Input
          label="Phone"
          value={isEditing ? editedUser.phone || '' : user.phone || ''}
          onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
          disabled={!isEditing}
          icon={<Phone className="h-4 w-4" />}
          fullWidth
        />
      </div>

      {isEditing && (
        <div className="flex space-x-4">
          <Button variant="primary" onClick={handleSave} icon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );

  const renderSafetyTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Safety Settings</h2>

      {/* Emergency Contacts */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addEmergencyContact}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Contact
          </Button>
        </div>

        <div className="space-y-4">
          {editedUser.emergencyContacts.map(contact => (
            <div key={contact.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Name"
                  value={contact.name}
                  onChange={(e) => updateEmergencyContact(contact.id, 'name', e.target.value)}
                  fullWidth
                />
                <Input
                  placeholder="Phone"
                  value={contact.phone}
                  onChange={(e) => updateEmergencyContact(contact.id, 'phone', e.target.value)}
                  fullWidth
                />
                <Input
                  placeholder="Relationship"
                  value={contact.relationship}
                  onChange={(e) => updateEmergencyContact(contact.id, 'relationship', e.target.value)}
                  fullWidth
                />
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contact.isPrimary}
                      onChange={(e) => updateEmergencyContact(contact.id, 'isPrimary', e.target.checked)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">Primary</span>
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmergencyContact(contact.id)}
                    icon={<Trash2 className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Safety Preferences */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-gray-900 font-medium">Share location with emergency contacts</span>
              <p className="text-sm text-gray-600">Allow emergency contacts to see your real-time location</p>
            </div>
            <input
              type="checkbox"
              checked={editedUser.safetySettings.shareLocationWithContacts}
              onChange={(e) => setEditedUser(prev => ({
                ...prev,
                safetySettings: { ...prev.safetySettings, shareLocationWithContacts: e.target.checked }
              }))}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-gray-900 font-medium">Enable SOS alerts</span>
              <p className="text-sm text-gray-600">Quick access to emergency services and contacts</p>
            </div>
            <input
              type="checkbox"
              checked={editedUser.safetySettings.sosEnabled}
              onChange={(e) => setEditedUser(prev => ({
                ...prev,
                safetySettings: { ...prev.safetySettings, sosEnabled: e.target.checked }
              }))}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-gray-900 font-medium">Prefer female-only services</span>
              <p className="text-sm text-gray-600">Prioritize female drivers, guides, and accommodations</p>
            </div>
            <input
              type="checkbox"
              checked={editedUser.safetySettings.femaleOnlyServices}
              onChange={(e) => setEditedUser(prev => ({
                ...prev,
                safetySettings: { ...prev.safetySettings, femaleOnlyServices: e.target.checked }
              }))}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-gray-900 font-medium">Auto check-in</span>
              <p className="text-sm text-gray-600">Automatically send safety check-ins during trips</p>
            </div>
            <input
              type="checkbox"
              checked={editedUser.safetySettings.autoCheckIn}
              onChange={(e) => setEditedUser(prev => ({
                ...prev,
                safetySettings: { ...prev.safetySettings, autoCheckIn: e.target.checked }
              }))}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
          </label>
        </div>
      </Card>
    </div>
  );

  const renderAccessibilityTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Accessibility Needs</h2>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Accessibility</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-900">Wheelchair accessible venues required</span>
            <input
              type="checkbox"
              checked={editedUser.accessibilityNeeds?.wheelchairAccessible}
              onChange={(e) => setEditedUser(prev => ({
                ...prev,
                accessibilityNeeds: { ...prev.accessibilityNeeds!, wheelchairAccessible: e.target.checked }
              }))}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-900">Visual impairment support needed</span>
            <input
              type="checkbox"
              checked={editedUser.accessibilityNeeds?.visualImpairment}
              onChange={(e) => setEditedUser(prev => ({
                ...prev,
                accessibilityNeeds: { ...prev.accessibilityNeeds!, visualImpairment: e.target.checked }
              }))}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-900">Hearing impairment support needed</span>
            <input
              type="checkbox"
              checked={editedUser.accessibilityNeeds?.hearingImpairment}
              onChange={(e) => setEditedUser(prev => ({
                ...prev,
                accessibilityNeeds: { ...prev.accessibilityNeeds!, hearingImpairment: e.target.checked }
              }))}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-900">Cognitive support needed</span>
            <input
              type="checkbox"
              checked={editedUser.accessibilityNeeds?.cognitiveSupport}
              onChange={(e) => setEditedUser(prev => ({
                ...prev,
                accessibilityNeeds: { ...prev.accessibilityNeeds!, cognitiveSupport: e.target.checked }
              }))}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
          </label>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Support</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese'].map(language => (
            <label key={language} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editedUser.accessibilityNeeds?.languageSupport.includes(language)}
                onChange={(e) => {
                  const languages = editedUser.accessibilityNeeds?.languageSupport || [];
                  const newLanguages = e.target.checked
                    ? [...languages, language]
                    : languages.filter(l => l !== language);
                  setEditedUser(prev => ({
                    ...prev,
                    accessibilityNeeds: { ...prev.accessibilityNeeds!, languageSupport: newLanguages }
                  }));
                }}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Travel Preferences</h2>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Style</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
            <select
              value={editedUser.preferences.budget}
              onChange={(e) => setEditedUser(prev => ({
                ...prev,
                preferences: { ...prev.preferences, budget: e.target.value as any }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="budget">Budget (₹1,000-3,000/day)</option>
              <option value="mid-range">Mid-range (₹3,000-8,000/day)</option>
              <option value="luxury">Luxury (₹8,000+/day)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Travel Style</label>
            <select
              value={editedUser.preferences.travelStyle}
              onChange={(e) => setEditedUser(prev => ({
                ...prev,
                preferences: { ...prev.preferences, travelStyle: e.target.value as any }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="solo">Solo Explorer</option>
              <option value="group">Group Travel</option>
              <option value="family">Family Friendly</option>
              <option value="adventure">Adventure Seeker</option>
              <option value="relaxation">Relaxation Focused</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Culture & Heritage', 'Adventure Sports', 'Nature & Wildlife', 'Food & Cuisine',
            'Photography', 'Spiritual & Wellness', 'Art & Museums', 'Nightlife & Entertainment',
            'Shopping', 'Beach & Water Sports', 'Mountains & Trekking', 'Local Experiences'
          ].map(interest => (
            <label key={interest} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editedUser.preferences.interests.includes(interest)}
                onChange={(e) => {
                  const interests = editedUser.preferences.interests;
                  const newInterests = e.target.checked
                    ? [...interests, interest]
                    : interests.filter(i => i !== interest);
                  setEditedUser(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, interests: newInterests }
                  }));
                }}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">{interest}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Restrictions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'No Restrictions'].map(diet => (
            <label key={diet} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editedUser.preferences.dietaryRestrictions.includes(diet)}
                onChange={(e) => {
                  const restrictions = editedUser.preferences.dietaryRestrictions;
                  const newRestrictions = e.target.checked
                    ? [...restrictions, diet]
                    : restrictions.filter(r => r !== diet);
                  setEditedUser(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, dietaryRestrictions: newRestrictions }
                  }));
                }}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">{diet}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
          <p className="text-lg text-gray-600">
            Manage your account, safety settings, and travel preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-0">
              <nav className="space-y-1">
                {tabs.map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'safety' && renderSafetyTab()}
              {activeTab === 'accessibility' && renderAccessibilityTab()}
              {activeTab === 'preferences' && renderPreferencesTab()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;