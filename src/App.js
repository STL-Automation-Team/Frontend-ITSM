import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Components/BasicLayout';
import Login from './Components/Login';
import Dashboard from './Pages/DashboardComponents/Dashboard';
import IncidentHome from './Pages/Incidents/IncidentHome';
import AddIncident from './Pages/Incidents/AddIncident';
import ViewIncidentDetails from './Pages/Incidents/ViewIncidentDetails';
import { DataContextProvider } from './Components/DataContext'; // Add this import
import { AuthProvider } from './Components/AuthProvider';
import { ProtectedRoute } from './Components/AuthProvider';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />
        
        {/* Protected routes with Layout and DataContext */}
        <Route
          path="/*"
          element={
            // <DataContextProvider>  {/* Add DataContextProvider here */}
          
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/incident/view" element={<ProtectedRoute><IncidentHome /></ProtectedRoute>} />
                  <Route path="/incident/create" element={<ProtectedRoute><AddIncident /></ProtectedRoute>} />
                  <Route path="/incidents/:id" element={<ProtectedRoute><ViewIncidentDetails /></ProtectedRoute>} />
                </Routes>
              </Layout>
            
          
          }
        />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;