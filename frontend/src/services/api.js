const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8081/api';

// Get current user ID from localStorage
const getCurrentUserId = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).id : null;
};

// API utility functions
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    
    return response;
  },

  signup: async (userData) => {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// User Profile API
export const userAPI = {
  getProfile: () => {
    const userId = getCurrentUserId();
    return apiRequest(`/users/profile/${userId}`);
  },
  
  updateProfile: (profileData) => {
    const userId = getCurrentUserId();
    return apiRequest(`/users/profile/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  },
};

// Medical Conditions API
export const medicalConditionsAPI = {
  getAll: () => {
    const userId = getCurrentUserId();
    return apiRequest(`/medical-conditions/user/${userId}`);
  },
  
  create: (condition) => {
    const userId = getCurrentUserId();
    return apiRequest(`/medical-conditions/user/${userId}`, {
    method: 'POST',
    body: JSON.stringify(condition),
  });
  },
  
  update: (id, condition) => apiRequest(`/medical-conditions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(condition),
  }),
  
  delete: (id) => apiRequest(`/medical-conditions/${id}`, {
    method: 'DELETE',
  }),
};

// Allergies API
export const allergiesAPI = {
  getAll: () => {
    const userId = getCurrentUserId();
    return apiRequest(`/allergies/user/${userId}`);
  },
  
  create: (allergy) => {
    const userId = getCurrentUserId();
    return apiRequest(`/allergies/user/${userId}`, {
    method: 'POST',
    body: JSON.stringify(allergy),
  });
  },
  
  update: (id, allergy) => apiRequest(`/allergies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(allergy),
  }),
  
  delete: (id) => apiRequest(`/allergies/${id}`, {
    method: 'DELETE',
  }),
};

// Appointments API
export const appointmentsAPI = {
  getAll: () => {
    const userId = getCurrentUserId();
    return apiRequest(`/appointments/user/${userId}`);
  },
  
  getUpcoming: () => {
    const userId = getCurrentUserId();
    return apiRequest(`/appointments/user/${userId}/upcoming`);
  },
  
  getPast: () => {
    const userId = getCurrentUserId();
    return apiRequest(`/appointments/user/${userId}/past`);
  },
  
  create: (appointment) => {
    const userId = getCurrentUserId();
    return apiRequest(`/appointments/user/${userId}`, {
    method: 'POST',
    body: JSON.stringify(appointment),
  });
  },
  
  update: (id, appointment) => apiRequest(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(appointment),
  }),
  
  delete: (id) => apiRequest(`/appointments/${id}`, {
    method: 'DELETE',
  }),
};

// Medications API
export const medicationsAPI = {
  getAll: () => {
    const userId = getCurrentUserId();
    return apiRequest(`/medications/user/${userId}`);
  },
  
  getCurrent: () => {
    const userId = getCurrentUserId();
    return apiRequest(`/medications/user/${userId}/current`);
  },
  
  getAsNeeded: () => {
    const userId = getCurrentUserId();
    return apiRequest(`/medications/user/${userId}/as-needed`);
  },
  
  create: (medication) => {
    const userId = getCurrentUserId();
    return apiRequest(`/medications/user/${userId}`, {
    method: 'POST',
    body: JSON.stringify(medication),
  });
  },
  
  update: (id, medication) => apiRequest(`/medications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(medication),
  }),
  
  delete: (id) => apiRequest(`/medications/${id}`, {
    method: 'DELETE',
  }),
};

// Lab Results API
export const labResultsAPI = {
  getAll: () => {
    const userId = getCurrentUserId();
    return apiRequest(`/lab-results/user/${userId}`);
  },
  
  create: (labResult) => {
    const userId = getCurrentUserId();
    return apiRequest(`/lab-results/user/${userId}`, {
    method: 'POST',
    body: JSON.stringify(labResult),
  });
  },
  
  update: (id, labResult) => apiRequest(`/lab-results/${id}`, {
    method: 'PUT',
    body: JSON.stringify(labResult),
  }),
  
  delete: (id) => apiRequest(`/lab-results/${id}`, {
    method: 'DELETE',
  }),
};

// Error handling utility
export const handleAPIError = (error) => {
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    authAPI.logout();
    window.location.href = '/login';
  } else if (error.message.includes('403')) {
    // Forbidden
    console.error('Access forbidden');
  } else if (error.message.includes('404')) {
    // Not found
    console.error('Resource not found');
  } else if (error.message.includes('500')) {
    // Server error
    console.error('Server error occurred');
  } else {
    // Network or other errors
    console.error('Network error:', error.message);
  }
  
  throw error;
};