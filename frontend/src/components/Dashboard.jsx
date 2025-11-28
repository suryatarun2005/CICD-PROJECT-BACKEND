import React from 'react';
import { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Weight,
  Calendar,
  Pill,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { VitalCard } from './VitalCard';
import { RecentActivity } from './RecentActivity';
import { UpcomingAppointments } from './UpcomingAppointments';
import { appointmentsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointments = await appointmentsAPI.getUpcoming();
        setUpcomingAppointments(appointments);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const vitals = [
    {
      label: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      icon: Heart,
      trend: 'stable'
    },
    {
      label: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      icon: Activity,
      trend: 'up'
    },
    {
      label: 'Temperature',
      value: '98.6',
      unit: '°F',
      status: 'normal',
      icon: Thermometer,
      trend: 'stable'
    },
    {
      label: 'Weight',
      value: '165',
      unit: 'lbs',
      status: 'normal',
      icon: Weight,
      trend: 'down'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600">
          Here's an overview of your health information and recent activity.
        </p>
      </div>

      {/* Vital Signs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-sky-600" />
          Current Vital Signs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vitals.map((vital, index) => (
            <VitalCard key={index} {...vital} />
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900">Medication Reminder</h3>
            <p className="text-amber-700 text-sm mt-1">
              Don't forget to take your blood pressure medication at 8:00 PM today.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-sky-600" />
            Upcoming Appointments
          </h2>
          <UpcomingAppointments appointments={upcomingAppointments} loading={loading} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-sky-600" />
            Recent Activity
          </h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};