import AxiosInstance from '../../Components/AxiosInstance';

const BASE_URL = 'http://10.100.130.76:3000';

export const fetchCategories = async (departmentId) => {
  try {
    const response = await AxiosInstance.get(`${BASE_URL}/api/v1/incident-categories/nested/?department_id=${departmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchContacts = async () => {
    try {
      const response = await AxiosInstance.get(`${BASE_URL}/contact/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching statuses:', error);
      return [];
    }
  };


  export const fetchAssignmentGroup = async () => {
    try {
      const response = await AxiosInstance.get(`${BASE_URL}/api/v1/workgroups/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching statuses:', error);
      return [];
    }
  };

export const fetchSubcategories = async (categoryId) => {
  try {
    const response = await AxiosInstance.get(`${BASE_URL}/api/v1/incident-categories/${categoryId}/children`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};

export const fetchStatuses = async () => {
  try {
    const response = await AxiosInstance.get(`${BASE_URL}/api/v1/statuses/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statuses:', error);
    return [];
  }
};

export const fetchPriorities = async () => {
  try {
    const response = await AxiosInstance.get(`${BASE_URL}/api/v1/priority`);
    return response.data;
  } catch (error) {
    console.error('Error fetching priorities:', error);
    return [];
  }
};



export const fetchDepartments = async () => {
    try {
      const response = await AxiosInstance.get(`${BASE_URL}/departments/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching priorities:', error);
      return [];
    }
  };