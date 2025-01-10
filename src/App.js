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
import MyCreatedIncidents from './Pages/Incidents/MyCreatedIncidents';
import MyAssignedIncidents from './Pages/Incidents/MyAssignedIncidents';
import IncidentDashboard from './Pages/Incidents/IncidentDashboard';
import IncidentReports from './Pages/Incidents/IncidentReports';
import UserProfile from './Pages/UserManagement/UserProfile';

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
                  <Route path="/incident/allincidents" element={<ProtectedRoute><IncidentHome /></ProtectedRoute>} />
                  <Route path="/incident/mycreatedincidents" element={<ProtectedRoute><MyCreatedIncidents /></ProtectedRoute>} />
                  <Route path="/incident/myassignedincidents" element={<ProtectedRoute><MyAssignedIncidents /></ProtectedRoute>} />
                  <Route path="/incident/create" element={<ProtectedRoute><AddIncident /></ProtectedRoute>} />
                  <Route path="/incidents/:id" element={<ProtectedRoute><ViewIncidentDetails /></ProtectedRoute>} />
                  <Route path="/incident/dashboard" element={<ProtectedRoute>< IncidentDashboard/></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute>< IncidentReports/></ProtectedRoute>} />
                  <Route path="/userprofile" element={<ProtectedRoute>< UserProfile/></ProtectedRoute>} />
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