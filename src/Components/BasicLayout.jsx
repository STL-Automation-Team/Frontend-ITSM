import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidenav from './Sidenav';

const Layout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      overflow: 'hidden', // Prevents horizontal scrolling
      backgroundColor: '#F5F6FA',
    }}>
      {/* Navbar with higher z-index */}
      <Box sx={{ 
        // position: 'fixed',
        // top: 0,
        // left: 0,
        // right: 0,
        // zIndex: 900 // Higher z-index to stay on top
      }}>
        <Navbar />
      </Box>

      {/* Content area */}
      <Box sx={{ 
        display: 'flex',
        flex: 1,
        pt: '64px', // Height of navbar
        height: '100vh'
      }}>
        {/* Sidenav */}
        <Box sx={{ 
          // position: 'fixed',
          // left: 0,
          // top: '64px', // Below navbar
          // bottom: 0,
          // overflowY: 'auto',
          // overflowX: 'hidden',
          // zIndex: 1000
        }}>
          <Sidenav />
        </Box>

        {/* Main content area */}
        <Box sx={{ 
          flexGrow: 1,
          height: 'calc(100vh - 64px)', // Full height minus navbar
          overflowY: 'auto', // Allow vertical scrolling for content
          overflowX: 'hidden', // Prevent horizontal scrolling
          padding:'0.5rem 2rem',
          
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;