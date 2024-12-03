import React, { useState, useEffect } from 'react';
import { Box, Tab, Typography, TextField, Button } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import AxiosInstance from '../../Components/AxiosInstance';

const CommunicationLogs = ({ incidentId, onIncidentUpdate }) => {
  const [tab, setTab] = useState("1");
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const fetchLogs = async () => {
    try {
      const response = await AxiosInstance.get(`http://10.100.130.76:3000/api/audit_trail/`, {
        params: {
          skip: 0,
          limit: 100,
          entity_id: incidentId
        }
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, [incidentId]);

  // Optionally, add a method to trigger logs refresh when incident is updated
  useEffect(() => {
    if (onIncidentUpdate) {
      fetchLogs();
    }
  }, [onIncidentUpdate]);
  
  const handleCommentSubmit = async () => {
    try {
      const contactId = localStorage.getItem('contactID');
      const response = await AxiosInstance.post('/public_log/', {
        description: comment,
        incident_id: incidentId,
        user_id: contactId
      });
      
      if (response.data) {
        setComment('');
        const newComments = [...comments, response.data];
        setComments(newComments);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const formatLogMessage = (log) => {
    return (
      <Box 
        sx={{ 
          mb: 2,
          p: 1.5,
          borderLeft: '3px solid #e0e0e0',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderLeftColor: 'primary.main'
          }
        }}
      >
        <Typography sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
          {log.description}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
          {new Date(log.timestamp).toLocaleString()}
        </Typography>
      </Box>
    );
  };
  
  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Communication" value="1" />
          <Tab label="Logs" value="2" />
        </TabList>
      </Box>
      
      <TabPanel value="1">
        <Box mb={2}>
          {comments.map((comment, index) => (
            <Box 
              key={index} 
              mb={2} 
              p={2} 
              bgcolor="grey.100" 
              borderRadius={1}
              sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
            >
              <Typography variant="subtitle2">{comment.contact_name}</Typography>
              <Typography>{comment.description}</Typography>
              <Typography variant="caption">{new Date(comment.created_time).toLocaleString()}</Typography>
            </Box>
          ))}
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your comment..."
        />
        <Box mt={1}>
          <Button variant="contained" onClick={handleCommentSubmit}>
            Save
          </Button>
        </Box>
      </TabPanel>
      
      <TabPanel value="2">
        <Box>
          {logs.map((log) => (
            <React.Fragment key={log.audit_id}>
              {formatLogMessage(log)}
            </React.Fragment>
          ))}
        </Box>
      </TabPanel>
    </TabContext>
  );
};

export default CommunicationLogs;