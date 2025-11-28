import React, { useState } from 'react';
import { useEffect } from 'react';
import { TestTube, TrendingUp, TrendingDown, Download, Eye, Plus, X, Save } from 'lucide-react';
import { labResultsAPI } from '../services/api';

export const LabResults = () => {
  const [selectedCategory, setSelectedCategory] = useState('recent');
  const [showAddForm, setShowAddForm] = useState(false);
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    testName: '',
    date: '',
    orderedBy: '',
    results: [{ name: '', value: '', unit: '', range: '', status: 'normal' }]
  });

  useEffect(() => {
    fetchLabResults();
  }, []);

  const fetchLabResults = async () => {
    try {
      setLoading(true);
      const results = await labResultsAPI.getAll();
      setLabResults(results);
    } catch (error) {
      console.error('Error fetching lab results:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    normal: 'text-emerald-700 bg-emerald-100',
    high: 'text-red-700 bg-red-100',
    low: 'text-amber-700 bg-amber-100'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'high':
        return <TrendingUp className="h-3 w-3" />;
      case 'low':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleAddLabResult = () => {
    setShowAddForm(true);
    setFormData({
      testName: '',
      date: '',
      orderedBy: '',
      results: [{ name: '', value: '', unit: '', range: '', status: 'normal' }]
    });
  };

  const handleSaveLabResult = () => {
    const saveLabResult = async () => {
      try {
        const labResultData = {
      testName: formData.testName,
      date: formData.date,
      orderedBy: formData.orderedBy,
          status: 'COMPLETED',
          testResults: formData.results.filter(r => r.name && r.value).map(result => ({
            ...result,
            status: result.status.toUpperCase()
          }))
        };
        
        await labResultsAPI.create(labResultData);
        setShowAddForm(false);
        fetchLabResults();
      } catch (error) {
        console.error('Error saving lab result:', error);
      }
    };
    
    saveLabResult();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResultChange = (index, field, value) => {
    const newResults = [...formData.results];
    newResults[index] = { ...newResults[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      results: newResults
    }));
  };

  const addResultField = () => {
    setFormData(prev => ({
      ...prev,
      results: [...prev.results, { name: '', value: '', unit: '', range: '', status: 'normal' }]
    }));
  };

  const removeResultField = (index) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Lab Results</h1>
        <button 
          onClick={handleAddLabResult}
          className="flex items-center space-x-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lab Result</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setSelectedCategory('recent')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === 'recent'
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Recent Results
        </button>
        <button
          onClick={() => setSelectedCategory('trends')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === 'trends'
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Trends
        </button>
      </div>

      {/* Add Lab Result Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Lab Result</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                <input
                  type="text"
                  name="testName"
                  value={formData.testName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter test name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordered By</label>
                <input
                  type="text"
                  name="orderedBy"
                  value={formData.orderedBy}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter doctor name"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Test Results</label>
                <button
                  type="button"
                  onClick={addResultField}
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  + Add Result
                </button>
              </div>
              
              {formData.results.map((result, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={result.name}
                    onChange={(e) => handleResultChange(index, 'name', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Test name"
                  />
                  <input
                    type="text"
                    value={result.value}
                    onChange={(e) => handleResultChange(index, 'value', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Value"
                  />
                  <input
                    type="text"
                    value={result.unit}
                    onChange={(e) => handleResultChange(index, 'unit', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Unit"
                  />
                  <input
                    type="text"
                    value={result.range}
                    onChange={(e) => handleResultChange(index, 'range', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Normal range"
                  />
                  <select
                    value={result.status}
                    onChange={(e) => handleResultChange(index, 'status', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeResultField(index)}
                    className="p-2 text-red-600 hover:text-red-700"
                    disabled={formData.results.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveLabResult}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Add Lab Result</span>
            </button>
          </div>
        </div>
      )}

      {/* Lab Results */}
      {selectedCategory === 'recent' && (
        loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : labResults.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Results</h3>
            <p className="text-gray-600">No lab results have been recorded yet.</p>
          </div>
        ) : (
        <div className="space-y-6">
          {labResults.map((lab) => (
            <div key={lab.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-sky-100 rounded-lg p-2">
                    <TestTube className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{lab.testName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>Date: {new Date(lab.date).toLocaleDateString()}</span>
                      <span>Ordered by: {lab.orderedBy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 text-sky-600 hover:text-sky-700 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sky-600 hover:text-sky-700 text-sm">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {(lab.testResults || []).map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{result.name}</span>
                        {getStatusIcon(result.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {result.value} {result.unit}
                        </div>
                        <div className="text-gray-600">Range: {result.range}</div>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusColors[result.status]}`}>
                        {getStatusIcon(result.status)}
                        <span className="capitalize">{result.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Abnormal Results Alert */}
              {(lab.testResults || []).some(result => result.status?.toLowerCase() !== 'normal') && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <strong>Note:</strong> Some values are outside the normal range. 
                    Please discuss these results with your healthcare provider.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        )
      )}

      {/* Trends View */}
      {selectedCategory === 'trends' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Trend Analysis</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Track your lab results over time to see trends and patterns. 
              Charts and graphs will be available once you have multiple test results for comparison.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};