import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext();

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataContextProvider');
  }
  return context;
};

export const DataContextProvider = ({ children }) => {
  const [callers, setCallers] = useState({});
  const [departments, setDepartments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [callersResponse, departmentsResponse] = await Promise.all([
          fetch('http://10.100.130.76:3000/contact/'),
          fetch('http://10.100.130.76:3000/departments')
        ]);

        if (!callersResponse.ok || !departmentsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [callersData, departmentsData] = await Promise.all([
          callersResponse.json(),
          departmentsResponse.json()
        ]);

        // console.log(callersData);

        const callersMap = callersData.reduce((acc, caller) => {
          acc[caller.id] = caller.name;
          return acc;
        }, {});

        const departmentsMap = departmentsData.reduce((acc, dept) => {
          acc[dept.id] = dept.name;
          return acc;
        }, {});

        setCallers(callersMap);
        setDepartments(departmentsMap);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load necessary data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ 
      callers, 
      departments, 
      isLoading,
      error 
    }}>
      {children}
    </DataContext.Provider>
  );
};