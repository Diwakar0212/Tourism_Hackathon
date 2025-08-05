import React, { useState } from 'react';
import { useSafety } from '../../contexts/SafetyContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import FormInput from '../forms/FormInput';
import FormSelect from '../forms/FormSelect';
import Badge from '../common/Badge';
import { Plus, Edit, Trash2, Phone, Mail, Star, User } from 'lucide-react';

export const EmergencyContacts: React.FC = () => {
  const { emergencyContacts, addEmergencyContact, updateEmergencyContact, removeEmergencyContact } = useSafety();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: '',
    isPrimary: false
  });

  const relationshipOptions = [
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'spouse', label: 'Spouse/Partner' },
    { value: 'child', label: 'Child' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'other', label: 'Other' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      relationship: '',
      isPrimary: false
    });
  };

  const handleAddContact = async () => {
    try {
      await addEmergencyContact(formData);
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  const handleEditContact = async () => {
    if (!editingContact) return;
    
    try {
      await updateEmergencyContact(editingContact.id, formData);
      setIsEditModalOpen(false);
      setEditingContact(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (confirm('Are you sure you want to remove this emergency contact?')) {
      try {
        await removeEmergencyContact(contactId);
      } catch (error) {
        console.error('Failed to remove contact:', error);
      }
    }
  };

  const openEditModal = (contact: any) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      relationship: contact.relationship,
      isPrimary: contact.isPrimary
    });
    setIsEditModalOpen(true);
  };

  const makeContactPrimary = async (contactId: string) => {
    try {
      // First, remove primary status from all contacts
      for (const contact of emergencyContacts) {
        if (contact.isPrimary) {
          await updateEmergencyContact(contact.id, { isPrimary: false });
        }
      }
      
      // Then make this contact primary
      await updateEmergencyContact(contactId, { isPrimary: true });
    } catch (error) {
      console.error('Failed to update primary contact:', error);
    }
  };

  const primaryContact = emergencyContacts.find(contact => contact.isPrimary);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Emergency Contacts</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Primary Contact */}
      {primaryContact && (
        <Card className="p-4 bg-teal-50 border-teal-200">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-5 w-5 text-teal-600 fill-current" />
            <h3 className="font-semibold text-teal-900">Primary Emergency Contact</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-teal-900">{primaryContact.name}</div>
              <div className="text-sm text-teal-700">{primaryContact.relationship}</div>
              <div className="text-sm text-teal-700">{primaryContact.phone}</div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEditModal(primaryContact)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Contact List */}
      {emergencyContacts.length === 0 ? (
        <Card className="p-8 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Contacts</h3>
          <p className="text-gray-600 mb-4">
            Add emergency contacts who will be notified in case of emergencies.
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add Your First Contact
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {emergencyContacts
            .filter(contact => !contact.isPrimary)
            .map((contact) => (
              <Card key={contact.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{contact.name}</h3>
                      <Badge variant="neutral" className="text-xs">
                        {contact.relationship}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => makeContactPrimary(contact.id)}
                      title="Make Primary"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(contact)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Emergency Contact Tips</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Choose contacts who are usually available and reliable</li>
              <li>• Include at least one local and one distant contact</li>
              <li>• Make sure your contacts know they're listed as emergency contacts</li>
              <li>• Keep contact information up to date</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add Emergency Contact"
      >
        <div className="space-y-4">
          <FormInput
            label="Full Name"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            required
          />
          
          <FormInput
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
            required
          />
          
          <FormInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          />
          
          <FormSelect
            label="Relationship"
            value={formData.relationship}
            onChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
            options={relationshipOptions}
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPrimary}
              onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Set as primary contact</span>
          </label>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddContact}
              disabled={!formData.name || !formData.phone || !formData.relationship}
              className="flex-1"
            >
              Add Contact
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Contact Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingContact(null);
          resetForm();
        }}
        title="Edit Emergency Contact"
      >
        <div className="space-y-4">
          <FormInput
            label="Full Name"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            required
          />
          
          <FormInput
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
            required
          />
          
          <FormInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          />
          
          <FormSelect
            label="Relationship"
            value={formData.relationship}
            onChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
            options={relationshipOptions}
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPrimary}
              onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Set as primary contact</span>
          </label>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleEditContact}
              disabled={!formData.name || !formData.phone || !formData.relationship}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingContact(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
