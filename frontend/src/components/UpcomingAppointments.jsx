import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const UpcomingAppointments = ({ appointments = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Appointments</h3>
        <p className="text-gray-600">You don't have any appointments scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
              <p className="text-sm text-gray-600">{appointment.specialty}</p>
            </div>
            <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-medium">
              {appointment.type}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(appointment.date).toLocaleDateString()}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{appointment.time || 'Time TBD'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{appointment.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};