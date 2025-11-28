import React, { useState } from 'react';
import { useEffect } from 'react';
import { Plus, Pill, Clock, AlertCircle, Save } from 'lucide-react';
import { medicationsAPI } from '../services/api';

export const Medications = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentMedications, setCurrentMedications] = useState([]);
  const [asNeededMedications, setAsNeededMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    prescribedBy: '',
    indication: '',
    refillsRemaining: '',
    instructions: ''
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const [current, asNeeded] = await Promise.all([
        medicationsAPI.getCurrent(),
        medicationsAPI.getAsNeeded()
      ]);
      setCurrentMedications(current);
      setAsNeededMedications(asNeeded);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMedication = () => {
    setShowAddForm(true);
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      time: '',
      prescribedBy: '',
      indication: '',
      refillsRemaining: '',
      instructions: ''
    });
  };

  const handleSaveMedication = () => {
    const saveMedication = async () => {
      try {
        const medicationData = {
          ...formData,
          type: activeTab === 'current' ? 'CURRENT' : 'AS_NEEDED',
          nextRefill: activeTab === 'current' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null
        };
        
        await medicationsAPI.create(medicationData);
        setShowAddForm(false);
        fetchMedications();
      } catch (error) {
        console.error('Error saving medication:', error);
      }
    };

    saveMedication();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Medications</h2>
        <button
          onClick={handleAddMedication}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('current')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'current'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Current Medications
          </button>
          <button
            onClick={() => setActiveTab('as-needed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'as-needed'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            As Needed
          </button>
        </nav>
      </div>

      {/* Add Medication Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add {activeTab === 'current' ? 'Current' : 'As Needed'} Medication
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter medication name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="e.g., 10 mg, 500 mcg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="As needed">As needed</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            {activeTab === 'current' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time(s)</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="e.g., 8:00 AM, 8:00 PM"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prescribed By</label>
              <input
                type="text"
                name="prescribedBy"
                value={formData.prescribedBy}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter doctor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Indication</label>
              <input
                type="text"
                name="indication"
                value={formData.indication}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="What is this medication for?"
              />
            </div>
            {activeTab === 'current' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refills Remaining</label>
                <input
                  type="number"
                  name="refillsRemaining"
                  value={formData.refillsRemaining}
                  onChange={handleInputChange}
                  min="0"
                  max="12"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            )}
            {activeTab === 'as-needed' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Special instructions for taking this medication"
                />
              </div>
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
              onClick={handleSaveMedication}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Add Medication</span>
            </button>
          </div>
        </div>
      )}

      {/* Current Medications */}
      {activeTab === 'current' && (
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : currentMedications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Medications</h3>
              <p className="text-gray-600">No current medications have been recorded yet.</p>
            </div>
          ) : (
            <>
              {/* Refill Alerts */}
              {currentMedications.some(med => med.refillsRemaining <= 1) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-900">Refill Reminder</h3>
                      <p className="text-amber-700 text-sm mt-1">
                        Some medications need refills soon. Check your medication list below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

          {currentMedications.map((medication) => (
            <div key={medication.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-sky-100 rounded-lg p-2">
                    <Pill className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                    <p className="text-gray-600">{medication.dosage} - {medication.frequency}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Schedule</p>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{medication.time}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Prescribed by</p>
                  <p className="text-gray-600">{medication.prescribedBy}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">For</p>
                  <p className="text-gray-600">{medication.indication}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Next Refill</p>
                  <p className="text-gray-600">{medication.nextRefill ? new Date(medication.nextRefill).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200 mt-4">
                <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                  Request Refill
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                  Edit
                </button>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Discontinue
                </button>
              </div>
            </div>
          ))}
            </>
          )}
        </div>
      )}

      {/* As Needed Medications */}
      {activeTab === 'as-needed' && (
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
        ) : asNeededMedications.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No As-Needed Medications</h3>
            <p className="text-gray-600">No as-needed medications have been recorded yet.</p>
          </div>
        ) : (
        <div className="space-y-4">
          {asNeededMedications.map((medication) => (
            <div key={medication.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3 mb-4">
                <div className="bg-emerald-100 rounded-lg p-2">
                  <Pill className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                  <p className="text-gray-600">{medication.dosage} - {medication.frequency}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="font-medium text-gray-700">Prescribed by</p>
                  <p className="text-gray-600">{medication.prescribedBy}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">For</p>
                  <p className="text-gray-600">{medication.indication}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Started</p>
                  <p className="text-gray-600">{medication.createdAt ? new Date(medication.createdAt).toLocaleDateString() : 'Not recorded'}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm font-medium">Instructions:</p>
                <p className="text-blue-700 text-sm">{medication.instructions}</p>
              </div>
            </div>
          ))}
        </div>
        )
      )}
    </div>
  );
};