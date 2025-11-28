import React, { useState } from 'react';
import { useEffect } from 'react';
import { FileText, AlertCircle, Plus, Stethoscope, X, Save } from 'lucide-react';
import { medicalConditionsAPI, allergiesAPI } from '../services/api';

export const MedicalHistory = () => {
  const [activeSection, setActiveSection] = useState('conditions');
  const [showAddForm, setShowAddForm] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Condition form
    name: '',
    status: 'Active',
    diagnosedDate: '',
    severity: 'Mild',
    notes: '',
    // Allergy form
    allergen: '',
    reaction: '',
    firstOccurrence: '',
    // Procedure form
    provider: '',
    facility: '',
    results: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [conditionsData, allergiesData] = await Promise.all([
        medicalConditionsAPI.getAll(),
        allergiesAPI.getAll()
      ]);
      setConditions(conditionsData);
      setAllergies(allergiesData);
      // Note: Procedures would need a separate API endpoint
      setProcedures([]);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  const severityColors = {
    'Mild': 'bg-emerald-100 text-emerald-700',
    'Moderate': 'bg-amber-100 text-amber-700',
    'Severe': 'bg-red-100 text-red-700'
  };

  const handleAddEntry = () => {
    setShowAddForm(true);
    // Reset form data
    setFormData({
      name: '',
      status: 'Active',
      diagnosedDate: '',
      severity: 'Mild',
      notes: '',
      allergen: '',
      reaction: '',
      firstOccurrence: '',
      provider: '',
      facility: '',
      results: ''
    });
  };

  const handleSaveEntry = () => {
    const saveData = async () => {
      try {
        if (activeSection === 'conditions') {
          const conditionData = {
        name: formData.name,
            status: formData.status.toUpperCase(),
        diagnosedDate: formData.diagnosedDate,
            severity: formData.severity.toUpperCase(),
        notes: formData.notes
      };
          await medicalConditionsAPI.create(conditionData);
        } else if (activeSection === 'allergies') {
          const allergyData = {
        allergen: formData.allergen,
        reaction: formData.reaction,
            severity: formData.severity.toUpperCase(),
        firstOccurrence: formData.firstOccurrence
      };
          await allergiesAPI.create(allergyData);
        }
        
        setShowAddForm(false);
        fetchData();
      } catch (error) {
        console.error('Error saving entry:', error);
      }
    };
    
    saveData();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderAddForm = () => {
    if (!showAddForm) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add New {activeSection === 'conditions' ? 'Condition' : activeSection === 'allergies' ? 'Allergy' : 'Procedure'}
          </h3>
          <button
            onClick={() => setShowAddForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeSection === 'conditions' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter condition name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosed Date</label>
                <input
                  type="date"
                  name="diagnosedDate"
                  value={formData.diagnosedDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Additional notes about this condition"
                />
              </div>
            </>
          )}

          {activeSection === 'allergies' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergen</label>
                <input
                  type="text"
                  name="allergen"
                  value={formData.allergen}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter allergen name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Occurrence</label>
                <input
                  type="date"
                  name="firstOccurrence"
                  value={formData.firstOccurrence}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reaction Description</label>
                <textarea
                  name="reaction"
                  value={formData.reaction}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Describe the allergic reaction"
                />
              </div>
            </>
          )}

          {activeSection === 'procedures' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Procedure Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter procedure name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="diagnosedDate"
                  value={formData.diagnosedDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input
                  type="text"
                  name="provider"
                  value={formData.provider}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter provider name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facility</label>
                <input
                  type="text"
                  name="facility"
                  value={formData.facility}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter facility name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Results</label>
                <textarea
                  name="results"
                  value={formData.results}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter procedure results"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEntry}
            className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Entry</span>
          </button>
        </div>
      </div>
    );
  };
  const sections = [
    { id: 'conditions', label: 'Conditions', icon: Stethoscope },
    { id: 'allergies', label: 'Allergies', icon: AlertCircle },
    { id: 'procedures', label: 'Procedures', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
        <button 
          onClick={handleAddEntry}
          className="flex items-center space-x-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 py-2 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === section.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Add Entry Form */}
      {renderAddForm()}

      {/* Conditions Section */}
      {activeSection === 'conditions' && (
        loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : conditions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Conditions</h3>
            <p className="text-gray-600">No medical conditions have been recorded yet.</p>
          </div>
        ) : (
        <div className="grid gap-4">
          {conditions.map((condition) => (
            <div key={condition.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{condition.name}</h3>
                  <p className="text-sm text-gray-600">Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                    {condition.status?.toLowerCase()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${severityColors[condition.severity?.toLowerCase()]}`}>
                    {condition.severity?.toLowerCase()}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">{condition.notes}</p>
            </div>
          ))}
        </div>
        )
      )}

      {/* Allergies Section */}
      {activeSection === 'allergies' && (
        loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : allergies.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Allergies</h3>
            <p className="text-gray-600">No allergies have been recorded yet.</p>
          </div>
        ) : (
        <div className="grid gap-4">
          {allergies.map((allergy) => (
            <div key={allergy.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{allergy.allergen}</h3>
                  <p className="text-sm text-gray-600">First occurrence: {new Date(allergy.firstOccurrence).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${severityColors[allergy.severity?.toLowerCase()]}`}>
                  {allergy.severity?.toLowerCase()}
                </span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm font-medium">Reaction:</p>
                <p className="text-red-700 text-sm">{allergy.reaction}</p>
              </div>
            </div>
          ))}
        </div>
        )
      )}

      {/* Procedures Section */}
      {activeSection === 'procedures' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Procedures Coming Soon</h3>
          <p className="text-gray-600">Procedure tracking will be available in a future update.</p>
        </div>
      )}
        {procedures.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Procedures</h3>
            <p className="text-gray-600">No procedures have been recorded yet.</p>
          </div>
        ) : (
        <div className="grid gap-4">
          {procedures.map((procedure) => (
            <div key={procedure.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{procedure.name}</h3>
                  <p className="text-sm text-gray-600">{new Date(procedure.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Provider</p>
                  <p className="text-sm text-gray-600">{procedure.provider}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Facility</p>
                  <p className="text-sm text-gray-600">{procedure.facility}</p>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-emerald-800 text-sm font-medium">Results:</p>
                <p className="text-emerald-700 text-sm">{procedure.results}</p>
              </div>
            </div>
          ))}
        </div>
        )}
    </div>
  );
};