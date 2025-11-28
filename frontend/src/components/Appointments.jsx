import React, { useState } from 'react';
import { useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Search, Filter, X, Save } from 'lucide-react';
import { appointmentsAPI } from '../services/api';

export const Appointments = () => {
  const [view, setView] = useState('upcoming');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    doctor: '',
    specialty: '',
    date: '',
    time: '',
    location: '',
    type: '',
    reason: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const [upcoming, past] = await Promise.all([
        appointmentsAPI.getUpcoming(),
        appointmentsAPI.getPast()
      ]);
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700'
  };

  const displayAppointments = view === 'upcoming' ? upcomingAppointments : pastAppointments;

  const handleScheduleAppointment = () => {
    setShowScheduleForm(true);
    setFormData({
      doctor: '',
      specialty: '',
      date: '',
      time: '',
      location: '',
      type: '',
      reason: ''
    });
  };

  const handleSaveAppointment = () => {
    const appointmentData = {
      doctor: formData.doctor,
      specialty: formData.specialty,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      type: formData.type,
      reason: formData.reason,
      status: 'PENDING'
    };
    
    appointmentsAPI.create(appointmentData)
      .then(() => {
        setShowScheduleForm(false);
        fetchAppointments();
      })
      .catch(error => {
        console.error('Error creating appointment:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <button 
          onClick={handleScheduleAppointment}
          className="flex items-center space-x-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex items-center space-x-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('upcoming')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'upcoming'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setView('past')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'past'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Past
          </button>
        </div>

        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter</span>
          </button>
        </div>
      </div>

      {/* Schedule Appointment Form */}
      {showScheduleForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Schedule New Appointment</h3>
            <button
              onClick={() => setShowScheduleForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
              <input
                type="text"
                name="doctor"
                value={formData.doctor}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter doctor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select specialty</option>
                <option value="Primary Care">Primary Care</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Endocrinologist">Endocrinologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Ophthalmologist">Ophthalmologist</option>
                <option value="Orthopedist">Orthopedist</option>
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter location/room"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select type</option>
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Annual Physical">Annual Physical</option>
                <option value="Procedure">Procedure</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Describe the reason for this appointment"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowScheduleForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAppointment}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Schedule Appointment</span>
            </button>
          </div>
        </div>
      )}

      {/* Appointments List */}
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
        ) : displayAppointments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {view === 'upcoming' ? 'Upcoming' : 'Past'} Appointments
            </h3>
            <p className="text-gray-600">
              {view === 'upcoming' 
                ? "You don't have any upcoming appointments scheduled." 
                : "You don't have any past appointments recorded."}
            </p>
          </div>
        ) : (
          <>
            {displayAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor}</h3>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-medium">
                      {appointment.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[appointment.status]}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time || 'Time TBD'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{appointment.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {view === 'upcoming' && appointment.status === 'confirmed' && (
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                  Reschedule
                </button>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Cancel
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                  Add to Calendar
                </button>
              </div>
            )}
          </div>
        ))}
            )
          </>
        )}
      </div>
    </div>
  );
};