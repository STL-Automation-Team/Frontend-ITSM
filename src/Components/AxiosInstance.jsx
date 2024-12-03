import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import SessionExpiryAlert from './SessionExpiryAlert';

const AxiosInstance = axios.create({
  baseURL: 'http://10.100.130.76:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

AxiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Check if the data is FormData and adjust content-type accordingly
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const showSessionExpiredAlert = () => {
  const alertRoot = document.createElement('div');
  document.body.appendChild(alertRoot);

  const handleClose = () => {
    ReactDOM.unmountComponentAtNode(alertRoot);
    document.body.removeChild(alertRoot);
    localStorage.removeItem('access_token');
    localStorage.removeItem('contact_id');
    window.location.href = '/';
  };

  ReactDOM.render(
    <SessionExpiryAlert
      open={true}
      message="Session expired, please login again!"
      onClose={handleClose}
    />,
    alertRoot
  );
};

AxiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      showSessionExpiredAlert();
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;