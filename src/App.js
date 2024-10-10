import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Pages/DashboardComponents/Dashboard';
import IncidentHome from './Pages/Incidents/IncidentHome';
import AddIncident from './Pages/Incidents/AddIncident';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incident/view" element={<IncidentHome />} />
        <Route path="/incident/create" element={<AddIncident/>} />
      </Routes>
    </Router>
  );
}

export default App;