import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  Typography,
  Autocomplete,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  fetchStatuses,
  fetchPriorities,
  fetchContacts,
  fetchDepartments,
  fetchAssignmentGroup,
} from "./APIServices";
import AxiosInstance from "../../Components/AxiosInstance";
import IncidentAddSuccessAlert from "./IncidentAddSuccessAlert";
import { useAuth } from "../../Components/AuthProvider";
import { useNavigate } from 'react-router-dom';


const colors = {
  primary: "#2196f3",
  success: "#4caf50",
  error: "#f44336",
  warning: "#ff9800",
  text: {
    primary: "#2c3345",
    secondary: "#6b7280",
  },
  background: {
    paper: "#ffffff",
    default: "#f8fafc",
  },
};


const IncidentForm = ({ onSubmit }) => {
  const { userRoles } = useAuth();
  const isUserRole = userRoles.includes('User');
  const [formData, setFormData] = useState({
    category: "", 
    categoryId: "", 
    subcategory: "", 
    status: "New",
    title: "",
    description: "",
    attachments: null,
    location_id: "2",
    contact_id: 0,
    department_id: 4, // Default department for User role
    assignment_group: "STL-GGN-IT",
    sla_status: "SLA Met",
    priority: "Low",
    cc: "",
  });


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error"
  });

  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [assignmentGroups, setAssignmentGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdIncidentNumber, setCreatedIncidentNumber] = useState('');

  const uploadButtonStyle = {
    border: "2px dashed #e5e7eb",
    borderRadius: "4px",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backgroundColor: "#f9fafb",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  };

  useEffect(() => {
    fetchContacts().then(setContacts);
    fetchStatuses().then(setStatuses);
    fetchPriorities().then(setPriorities);
    fetchAssignmentGroup().then(setAssignmentGroups);
    fetchDepartments().then(setDepartments);
  }, []);


  useEffect(() => {
    const fetchCategories = async () => {
      if (formData.department_id) {
        try {
          const response = await AxiosInstance.get(
            `http://10.100.130.76:3000/api/v1/incident-categories/nested/?department_id=${formData.department_id}`
          );
          setCategories(response.data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }
    };
    fetchCategories();
  }, [formData.department_id]);



   useEffect(() => {
    const fetchSubcategories = async () => {
      if (formData.categoryId) { // Use categoryId instead of category
        try {
          const response = await AxiosInstance.get(
            `http://10.100.130.76:3000/api/v1/incident-categories/${formData.categoryId}/children`
          );
          setSubcategories(response.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubcategories();
  }, [formData.categoryId]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find(cat => cat.id === e.target.value);
    setFormData(prev => ({
      ...prev,
      categoryId: selectedCategory.id, // Store ID for API calls
      category: selectedCategory.name, // Store name for submission
      subcategory: "" // Reset subcategory when category changes
    }));
  };


  const handleSubcategoryChange = (e) => {
    const selectedSubcategory = subcategories.find(subcat => subcat.name === e.target.value);
    if (selectedSubcategory) {
      setFormData(prev => ({
        ...prev,
        subcategory: selectedSubcategory.name // Store name for submission
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subcategory: "" // Reset to empty string if no subcategory found
      }));
    }
  };


  const handleFileUpload = () => {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.txt';
    fileInput.style.display = 'none';

    // Handle file selection
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size <= 2 * 1024 * 1024) { // 2MB limit
          setSelectedFile(file);
          setFormData(prev => ({
            ...prev,
            attachments: file
          }));
        } else {
          alert("File size should be less than 2MB");
        }
      }
    };

    // Trigger file selection dialog
    fileInput.click();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;

    // Validate required fields
    const requiredFields = [
      'priority',
      'location_id',
      'department_id',
      'sla_status',
      'status',
      'title',
      'contact_id',
      'description',
      'category'
      
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    // Create FormData instance
    const formDataToSend = new FormData();

    // Convert contact_id, location_id, and department_id to strings before appending
    formDataToSend.append("contact_id", String(formData.contact_id));
    formDataToSend.append("location_id", String(formData.location_id));
    formDataToSend.append("department_id", String(formData.department_id));

    // Append other required fields
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("sla_status", formData.sla_status);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("subcategory",formData.subcategory);

    // Handle attachments
    if (formData.attachments) {
      formDataToSend.append("attachments", formData.attachments);
    }

    try {
      const response = await AxiosInstance.post(
        "/incidents/",
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data) {
        setCreatedIncidentNumber(response.data.ref_id);
        setShowSuccessModal(true);
        onSubmit(response.data);
        setSelectedFile(null);
        // Optional: Reset form data here if needed
      }
    } catch (error) {
      console.error("Error submitting incident:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
        alert(`Error submitting incident: ${error.response.data.detail || 'Please try again'}`);
      } else {
        alert("Error submitting incident. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add these handler functions
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Optional: Reset form data here if needed
  };

  const handleViewDetails = () => {
    if(!isUserRole){
      navigate(`/incident/all?highlight=${createdIncidentNumber}`);
      setShowSuccessModal(false);
    }
    else {
      navigate(`/incident/my?highlight=${createdIncidentNumber}`);
      setShowSuccessModal(false);
    }
  };

  const inputStyle = {
    "& .MuiInputBase-root": {
      height: "36px",
      fontSize: "14px",
      backgroundColor: "#f9fafb",
      borderRadius: "4px",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#e5e7eb",
      },
      "&:hover fieldset": {
        borderColor: colors.primary,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.primary,
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "14px",
    },
  };


  const labelStyle = {
    fontSize: "14px",
    fontWeight: 500,
    color: colors.text.primary,
    display: "flex",
    alignItems: "center",
    "& .required": {
      color: colors.error,
      marginLeft: "4px",
    },
  };

  // const renderFormField = (
  //   label,
  //   name,
  //   component,
  //   required = false,
  //   tooltip = null
  // ) => (
  //   <Grid item xs={12} sm={6} container spacing={1}>
  //     <Grid item xs={12}>
  //       <Typography sx={labelStyle}>
  //         {label}
  //         {required && <span className="required">*</span>}
  //         {tooltip && (
  //           <IconButton size="small" sx={{ ml: 0.5 }}>
  //             <HelpOutlineIcon sx={{ fontSize: 16 }} />
  //           </IconButton>
  //         )}
  //       </Typography>
  //     </Grid>
  //     <Grid item xs={12}>
  //       {component}
  //     </Grid>
  //   </Grid>
  // );


  const renderFormField = (
    label,
    name,
    component,
    required = true,
    tooltip = null
  ) => (
    <Grid item xs={12} sm={6} container spacing={1}>
      <Grid item xs={12}>
        <Typography sx={labelStyle}>
          {label}
          {required && <span className="required">*</span>}
          {tooltip && (
            <IconButton size="small" sx={{ ml: 0.5 }}>
              <HelpOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {React.cloneElement(component, {
          disabled: isUserRole && ['status', 'priority', 'department_id', 'assignment_group'].includes(name)
          // disabled: isResolverRole && ['status', 'priority', 'department_id', 'assignment_group'].includes(name)
        })}
      </Grid>
    </Grid>
  );


  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Caller Name */}
        {renderFormField(
          "Caller",
          "contact_id",
          <Autocomplete
            size="small"
            options={contacts}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search caller"
                sx={inputStyle}
              />
            )}
            onChange={(_, newValue) =>
              setFormData({ ...formData, contact_id: newValue?.id || 0 })
            }
            fullWidth
          />,
          true
        )}

        {/* Status */}
        {renderFormField(
          "Status",
          "status",
          <FormControl fullWidth size="small">
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              sx={inputStyle}
              defaultValue="New"
              true
            >
              
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.name}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Department */}
        {renderFormField(
          "Department",
          "department_id",
          <FormControl fullWidth size="small">
            <Select
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              sx={inputStyle}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Category with Search */}
        {renderFormField(
          "Category",
          "category",
          <FormControl fullWidth size="small">
            <Select
              disabled={!formData.department_id}
              value={formData.categoryId || ""} // Use categoryId for Select value
              onChange={handleCategoryChange}
              name="category"
              sx={inputStyle}
            >
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No categories available</MenuItem>
              )}
            </Select>
          </FormControl>
        )}

        {/* Subcategory */}
        {renderFormField(
          "Subcategory",
          "subcategory",
          <FormControl fullWidth size="small">
            <Select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleSubcategoryChange}
              disabled={!formData.categoryId}
              sx={inputStyle}
            >
              {subcategories.map((subcat) => (
                <MenuItem key={subcat.id} value={subcat.name}>
                  {subcat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Assignment Group */}
        {renderFormField(
          "Assignment Group",
          "assignment_group",
          <FormControl fullWidth size="small">
            <Select
              name="assignment_group"
              value={formData.assignment_group}
              onChange={handleInputChange}
              sx={inputStyle}
            >
              {assignmentGroups.map((group) => (
                <MenuItem key={group.id} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Priority */}
        {renderFormField(
          "Priority",
          "priority",
          <FormControl fullWidth size="small">
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              sx={inputStyle}
              defaultValue="Low"
            >
              {priorities.map((priority) => (
                <MenuItem key={priority.id} value={priority.name}>
                  {priority.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* CC Field */}
        {/* {renderFormField(
          "CC",
          "cc",
          <TextField
            fullWidth
            size="small"
            name="cc"
            value={formData.cc}
            onChange={handleInputChange}
            sx={inputStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )} */}

        {/* Title */}
        {renderFormField(
          "Title",
          "title",
          <TextField
            fullWidth
            size="small"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Describe incident (Min. 20 words)"
            sx={inputStyle}
          />,
          true
        )}


        {renderFormField(
          "Description",
          "description",
          <TextField
            fullWidth
            multiline
            minRows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            // placeholder="Describe incident (Min. 20 words)"
            sx={{
              ...inputStyle,
              "& .MuiInputBase-root": {
                height: "auto",
                backgroundColor: "#f9fafb",
              },
            }}
          />,
          true
        )}

        {/* Description */}
        {/* <Grid item xs={12}>
          <Typography sx={labelStyle}>Description</Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            // placeholder="Minimum 50 words"
            required
            sx={{
              ...inputStyle,
              "& .MuiInputBase-root": {
                height: "auto",
                backgroundColor: "#f9fafb",
              },
            }}
          />
        </Grid> */}

        {/* Attachment */}
        <Grid item xs={12}>
          <Typography sx={labelStyle}>Attachment</Typography>
          <Box 
            sx={{
              ...uploadButtonStyle,
              backgroundColor: selectedFile ? '#e8f4ff' : '#f9fafb'
            }}
            onClick={handleFileUpload}
          >
            <CloudUploadIcon sx={{ mr: 1 }} />
            <Typography variant="body2">
              {selectedFile ? selectedFile.name : "Click to Upload (Max 2 MB)"}
            </Typography>
          </Box>
        </Grid>

        {/* Action Buttons */}
        <Grid
          item
          xs={12}
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}
        >
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              borderColor: "#e5e7eb",
              color: colors.text.primary,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: colors.primary,
              "&:hover": {
                backgroundColor: colors.primary + "dd",
              },
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      <IncidentAddSuccessAlert
        open={showSuccessModal}
        onClose={handleCloseSuccessModal}
        incidentNumber={createdIncidentNumber}
        onViewDetails={handleViewDetails}
      />
    </form>
  );
};

export default IncidentForm;
