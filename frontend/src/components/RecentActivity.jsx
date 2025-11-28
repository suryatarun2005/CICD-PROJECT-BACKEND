import React from 'react';
import { FileText, TestTube, Pill, Activity } from 'lucide-react';

export const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'lab-result',
      title: 'Blood Work Results',
      description: 'Complete metabolic panel results are now available',
      time: '2 hours ago',
      icon: TestTube,
      status: 'completed'
    },
    {
      id: 2,
      type: 'medication',
      title: 'Prescription Refilled',
      description: 'Lisinopril 10mg prescription has been refilled',
      time: '1 day ago',
      icon: Pill,
      status: 'completed'
    },
    {
      id: 3,
      type: 'vital-sign',
      title: 'Vital Signs Updated',
      description: 'Blood pressure and weight measurements logged',
      time: '3 days ago',
      icon: Activity,
      status: 'completed'
    },
    {
      id: 4,
      type: 'document',
      title: 'Medical Record Updated',
      description: 'Annual physical examination notes added',
      time: '1 week ago',
      icon: FileText,
      status: 'completed'
    }
  ];

  const statusColors = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activity.icon;
        return (
          <div
            key={activity.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start space-x-3">
              <div className="bg-sky-100 rounded-lg p-2">
                <Icon className="h-4 w-4 text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[activity.status]}`}>
                    {activity.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};