import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IncidentForm from './IncidentForm';

const IncidentManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://10.100.130.76:3000/contact/');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to fetch contacts');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://10.100.130.76:3000/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to fetch departments');
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await axios.get('http://10.100.130.76:3000/api/v1/priority');
      setPriorities(response.data);
    } catch (error) {
      console.error('Error fetching priorities:', error);
      setError('Failed to fetch priorities');
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axios.get('http://10.100.130.76:3000/api/v1/statuses');
      setStatuses(response.data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      setError('Failed to fetch statuses');
    }
  };

  const fetchCategories = async (departmentId) => {
    if (!departmentId) {
      setCategories([]);
      return;
    }
    try {
      const response = await axios.get(`http://10.100.130.76:3000/api/v1/incident-categories/nested/?department_id=${departmentId}`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
    }
  };

  // Function to flatten category hierarchy for subcategory selection
  const flattenCategories = (categories, parentCategory = null) => {
    let result = [];
    categories.forEach(category => {
      result.push({
        id: category.id,
        name: category.name,
        parentId: parentCategory ? parentCategory.id : null,
        parentName: parentCategory ? parentCategory.name : null
      });
      if (category.subcategories && category.subcategories.length > 0) {
        result = [...result, ...flattenCategories(category.subcategories, category)];
      }
    });
    return result;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchContacts(),
          fetchDepartments(),
          fetchPriorities(),
          fetchStatuses(),
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to fetch initial data');
      }
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post('http://10.100.130.76:3000/api/v1/incidents/', formData);
      console.log('Incident created:', response.data);
      // Handle success (e.g., show notification, redirect, etc.)
    } catch (error) {
      console.error('Error creating incident:', error);
      setError('Failed to create incident');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <IncidentForm
      contacts={contacts}
      departments={departments}
      priorities={priorities}
      statuses={statuses}
      categories={categories}
      onFetchCategories={fetchCategories}
      onSubmit={handleSubmit}
      flattenCategories={flattenCategories}
    />
  );
};

export default IncidentManagement;