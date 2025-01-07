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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchStatuses,
  fetchPriorities,
  fetchContacts,
  fetchDepartments,
  fetchAssignmentGroup,
} from "./APIServices";
import AxiosInstance from "../../Components/AxiosInstance";
import { useAuth } from "../../Components/AuthProvider";

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

const EditIncidentForm = ({ incidentData, onSubmit, formRef }) => {
  console.log("hi", incidentData);
  const { userRoles } = useAuth();
  const isUserRole = userRoles.includes("User");
  const isSDMRole = userRoles.includes("SDM");
  const isResolverRole = userRoles.includes("Resolver");
  const [formData, setFormData] = useState({
    title: incidentData.title,
    description: incidentData.description,
    priority: incidentData.priority,
    status: incidentData.status,
    sla_status: incidentData.sla_status,
    contact_id: incidentData.contact_id,
    department_id: incidentData.department_id,
    location_id: incidentData.location_id,
    assigned_to: incidentData.assigned_to,
    category: incidentData.category,
    subcategory: incidentData.subcategory,
    attachments: incidentData.attachments || [],
    contact: incidentData.contact_display,
    department: incidentData.department_display,
    assigned_to_name: incidentData.assigned_to_display,
    assignment_group: incidentData.work_group_display,
    ref_id: incidentData.ref_id,
    start_date: incidentData.start_date,
    work_group_id: incidentData.work_group_id,
    resolution_time: incidentData.resolution_time,
    response_time: incidentData.response_time,
  });

  console.log(formData);

  const [contacts, setContacts] = useState([]);
  const [isCloseIncident, setIsCloseIncident] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [assignmentGroups, setAssignmentGroups] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [editedIncident, setEditedIncident] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    // Attach the form ref
    if (formRef) {
      formRef(document.getElementById("edit-incident-form"));
    }
  }, [formRef]);

  // Fetch initial dropdown data
  useEffect(() => {
    Promise.all([
      fetchContacts().then(setContacts),
      fetchStatuses().then(setStatuses),
      fetchPriorities().then(setPriorities),
      fetchAssignmentGroup().then(setAssignmentGroups),
      fetchDepartments().then(setDepartments),
    ]);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (formData.department_id) {
        try {
          const response = await AxiosInstance.get(
            `http://10.100.130.76:3000/api/v1/incident-categories/nested/?department_id=${formData.department_id}`
          );
          setCategories(response.data);

          // If it's the initial load and there's a category, find its ID
          if (initialLoad && formData.category) {
            const foundCategory = response.data.find(
              (cat) => cat.name === formData.category
            );
            if (foundCategory) {
              setCurrentCategory(foundCategory);
              setFormData((prev) => ({
                ...prev,
                categoryId: foundCategory.id,
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }
    };

    fetchCategories();
  }, [formData.department_id]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (formData.categoryId) {
        try {
          const response = await AxiosInstance.get(
            `http://10.100.130.76:3000/api/v1/incident-categories/${formData.categoryId}/children`
          );
          setSubcategories(response.data);

          // If it's the initial load and there's a subcategory, ensure it's present
          if (initialLoad && formData.subcategory) {
            setInitialLoad(false);
          }
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubcategories();
  }, [formData.categoryId]);

  console.log(formData.work_group_id);

  useEffect(() => {
    const fetchWorkGroupUsers = async () => {
      console.log("bye", formData.work_group_id);
      if (formData.work_group_id) {
        try {
          const response = await AxiosInstance.get(
            `http://10.100.130.76:3000/api/v1/workgroups/${formData.work_group_id}/users`
          );
          setAssignedUsers(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching work group users:", error);
          // Optional: Set an empty array or show an error message
          setAssignedUsers([]);
        }
      }
    };

    fetchWorkGroupUsers();
  }, [formData.work_group_id]); // Ensure this dependency is correct

  console.log(assignedUsers);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find(
      (cat) => cat.id === e.target.value
    );

    if (selectedCategory) {
      setCurrentCategory(selectedCategory);
      setFormData((prev) => ({
        ...prev,
        categoryId: selectedCategory.id,
        category: selectedCategory.name,
        subcategory: "", // Reset subcategory when category changes
      }));
    }
  };

  const handleSubcategoryChange = (e) => {
    const selectedSubcategory = subcategories.find(
      (subcat) => subcat.name === e.target.value
    );

    if (selectedSubcategory) {
      setFormData((prev) => ({
        ...prev,
        subcategory: selectedSubcategory.name,
      }));
    }
  };

  const handleAssignmentGroupChange = async (e) => {
    const selectedGroup = assignmentGroups.find(
      (group) => group.name === e.target.value
    );

    if (selectedGroup) {
      setFormData((prev) => ({
        ...prev,
        assignment_group: selectedGroup.name,
        work_group_id: selectedGroup.id,
        assigned_to: "", // Reset assigned_to when group changes
      }));

      try {
        const response = await AxiosInstance.get(
          `http://10.100.130.76:3000/api/v1/workgroups/${selectedGroup.id}/users`
        );
        setAssignedUsers(response.data);
      } catch (error) {
        console.error("Error fetching work group users:", error);
        setAssignedUsers([]);
      }
    }
  };

  const handleFileUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg";
    fileInput.multiple = true;
    fileInput.onchange = (e) => {
      const newFiles = Array.from(e.target.files).filter(
        (file) => file.size <= 2 * 1024 * 1024
      );

      if (newFiles.length !== e.target.files.length) {
        setSnackbar({
          open: true,
          message: "Some files exceed 2MB limit and were not added",
          severity: "warning",
        });
      }

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    };
    fileInput.click();
  };

  // Handle file removal for new files and existing attachments
  const handleFileRemove = (index, isNewFile = true) => {
    setFormData((prev) => {
      if (isNewFile) {
        // Remove newly added file
        return {
          ...prev,
          attachments: prev.attachments.filter((_, i) => i !== index),
        };
      } else {
        // Remove existing attachment
        return {
          ...prev,
          attachments: prev.attachments.filter((_, i) => i !== index),
          removedAttachments: [
            ...(prev.removedAttachments || []),
            prev.attachments[index].id,
          ],
        };
      }
    });
  };

  console.log(isUserRole);
  console.log(isResolverRole);
  console.log(isSDMRole);
  console.log(formData.department_id);
  const isFieldDisabled = (fieldName) => {
    // For User role, all fields are disabled
    if (isUserRole) return true;

    // For Category field, disable if department_id is empty
    if (fieldName === "category") {
      if (!formData.department_id) return true; // Disable if department_id is empty
    }

    // For Subcategory field, disable if category_id is empty
    if (fieldName === "subcategory") {
      if (!formData.categoryId) return true; // Disable if category_id is empty
    }

    // For SDM role, disable certain fields if department_id is not set
    if (isSDMRole) {
      if (
        [
          "category",
          "subcategory",
          "attachments",
          "assignment_group",
          "assigned_to",
        ].includes(fieldName)
      ) {
        return !formData.department_id; // Disabled if department_id is not set
      }
    }

    // For Resolver role, disable category and subcategory
    if (isResolverRole && ["category", "subcategory"].includes(fieldName))
      return true;

    // For SDM and Resolver roles, only specific fields are editable
    const editableFields = [
      "status",
      "attachments",
      "assignment_group",
      "assigned_to",
      "cc",
    ];

    return !editableFields.includes(fieldName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isCloseIncident) {
        const closeResponse = await AxiosInstance.post(
          `http://10.100.130.76:3000/api/v1/incidents/${incidentData.id}/close`
        );

        setSuccessMessage(
          `Incident ${closeResponse.data.incident.ref_id} closed successfully`
        );
        setSuccessModalOpen(true);
      } else {
        const requiredFields = [
          "priority",
          "location_id",
          "department_id",
          "sla_status",
          "status",
          "title",
          "contact_id",
          "description",
          "category",
        ];

        const missingFields = requiredFields.filter(
          (field) => !formData[field]
        );
        if (missingFields.length > 0) {
          alert(
            `Please fill in all required fields: ${missingFields.join(", ")}`
          );
          return;
        }

        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append("contact_id", String(formData.contact_id));
        formDataToSend.append("location_id", String(formData.location_id));
        formDataToSend.append("department_id", String(formData.department_id));
        formDataToSend.append("priority", formData.priority);
        formDataToSend.append("sla_status", formData.sla_status);
        formDataToSend.append("status", formData.status);
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("subcategory", formData.subcategory);
        formDataToSend.append("assignment_group", formData.assignment_group);
        formDataToSend.append("assigned_to", formData.assigned_to);
        formDataToSend.append("cc", formData.cc);
        formDataToSend.append("work_group_id", String(formData.work_group_id));

        const newAttachments = formData.attachments.filter(
          (attachment) => !attachment.id
        );
        newAttachments.forEach((attachment) => {
          formDataToSend.append("attachments", attachment);
        });

        if (
          formData.removedAttachments &&
          formData.removedAttachments.length > 0
        ) {
          formDataToSend.append(
            "removed_attachments",
            JSON.stringify(formData.removedAttachments)
          );
        }

        const response = await AxiosInstance.put(
          `/incidents/${incidentData.id}/`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data) {
          setEditedIncident(response.data);
          setSuccessModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error submitting incident:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
        alert(
          `Error submitting incident: ${
            error.response.data.detail || "Please try again"
          }`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    window.location.reload();
    setShowSuccessModal(false);
  };

  const handleViewDetails = () => {
    console.log("View details clicked");
    setShowSuccessModal(false);
  };

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

  const renderCategoryField = () =>
    renderFormField(
      "Category",
      "category",
      <FormControl fullWidth size="small">
        <Select
          disabled={!formData.department_id}
          value={formData.categoryId || ""}
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
    );

  // Render subcategory field with special handling
  const renderSubcategoryField = () =>
    renderFormField(
      "Subcategory",
      "subcategory",
      <FormControl fullWidth size="small">
        <Select
          name="subcategory"
          value={formData.subcategory || ""}
          onChange={handleSubcategoryChange}
          disabled={!formData.categoryId}
          sx={inputStyle}
        >
          {subcategories && subcategories.length > 0 ? (
            subcategories.map((subcat) => (
              <MenuItem key={subcat.id} value={subcat.name}>
                {subcat.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No subcategories available</MenuItem>
          )}
        </Select>
      </FormControl>
    );

  const renderFormField = (
    label,
    name,
    component,
    required = false,
    tooltip = null
  ) => {
    // Determine if the field should be disabled
    const disabled = isFieldDisabled(name);

    return (
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
            disabled: disabled,
          })}
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {renderFormField(
            "Number",
            "ref_id",
            <TextField
              fullWidth
              size="small"
              value={formData.ref_id}
              sx={inputStyle}
              disabled
            />
          )}

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
              value={
                contacts.find(
                  (contact) => contact.id === formData.contact_id
                ) || null
              }
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
              >
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.name}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {isUserRole && formData.status === "Resolve" && (
            <Grid item xs={6} sx={{marginTop: "1.5rem"}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCloseIncident}
                    onChange={(e) => setIsCloseIncident(e.target.checked)}
                    name="closeIncident"
                    sx={inputStyle}
                  />
                }
                label="Close Incident"
              />
            </Grid>
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
          {renderCategoryField(
            "Category",
            "category",
            <FormControl fullWidth size="small">
              <Select
                disabled={isFieldDisabled("category")}
                value={formData.categoryId || ""}
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
          {renderSubcategoryField(
            "Subcategory",
            "subcategory",
            <FormControl fullWidth size="small">
              <Select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleSubcategoryChange}
                disabled={isFieldDisabled("subcategory")}
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
                onChange={(e) => {
                  // Find the selected group to get its ID
                  const selectedGroup = assignmentGroups.find(
                    (group) => group.name === e.target.value
                  );

                  setFormData((prev) => ({
                    ...prev,
                    assignment_group: e.target.value,
                    work_group_id: selectedGroup ? selectedGroup.id : null,
                  }));
                }}
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
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.id} value={priority.name}>
                    {priority.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {renderFormField(
            "Assigned To",
            "assigned_to",
            <FormControl fullWidth size="small">
              <Select
                name="assigned_to"
                value={formData.assigned_to || ""}
                onChange={handleInputChange}
                sx={inputStyle}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Assigned User
                </MenuItem>
                {assignedUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username || user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* CC Field */}
          {renderFormField(
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
          )}

          {/* created time */}
          {renderFormField(
            "Created Time",
            "start_date",
            <TextField
              fullWidth
              size="small"
              name="start_date"
              value={formData.start_date || ""}
              onChange={handleInputChange}
              sx={inputStyle}
            />,
            true
          )}

          {renderFormField(
            "Response Time",
            "response_time",
            <TextField
              fullWidth
              size="small"
              name="response_time"
              value={formData.response_time || ""}
              onChange={handleInputChange}
              sx={inputStyle}
            />,
            true
          )}

          {renderFormField(
            "Resolution Time",
            "resolution_time",
            <TextField
              fullWidth
              size="small"
              name="resolution_time"
              value={formData.resolution_time || ""}
              onChange={handleInputChange}
              sx={inputStyle}
            />,
            true
          )}

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
              sx={inputStyle}
            />,
            true
          )}

          {/* Description */}
          <Grid item xs={12}>
            <Typography sx={labelStyle}>Description</Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              sx={{
                ...inputStyle,
                "& .MuiInputBase-root": {
                  height: "auto",
                  backgroundColor: "#f9fafb",
                },
              }}
              disabled
            />
          </Grid>

          {/* Attachment Section */}
          <Grid item xs={12}>
            <Typography sx={labelStyle}>Attachments</Typography>
            <Box>
              {/* Existing Attachments */}
              {formData.attachments
                .filter((a) => a.id)
                .map((attachment, index) => (
                  <Chip
                    key={`existing-${attachment.id}`}
                    label={attachment.file_path.split("/").pop()}
                    onDelete={() => handleFileRemove(index, false)}
                    deleteIcon={<DeleteIcon />}
                    sx={{
                      mr: 1,
                      mt: 1,
                      backgroundColor: "#e8f4ff",
                      color: colors.primary,
                    }}
                  />
                ))}

              {/* Newly Added Attachments */}
              {formData.attachments
                .filter((a) => !a.id)
                .map((attachment, index) => (
                  <Chip
                    key={`new-${index}`}
                    label={attachment.name}
                    onDelete={() => handleFileRemove(index, true)}
                    deleteIcon={<DeleteIcon />}
                    sx={{
                      mr: 1,
                      mt: 1,
                      backgroundColor: "#e8f4ff",
                      color: colors.primary,
                    }}
                  />
                ))}

              <Box
                sx={{
                  ...uploadButtonStyle,
                  backgroundColor:
                    formData.attachments.length > 0 ? "#e8f4ff" : "#f9fafb",
                }}
                onClick={handleFileUpload}
              >
                <CloudUploadIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {formData.attachments.length > 0
                    ? `+${formData.attachments.length} more`
                    : "Click to Upload (Max 2 MB)"}
                </Typography>
              </Box>
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
              onClick={() => setShowSuccessModal(false)}
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
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Dialog
        open={successModalOpen}
        onClose={handleSuccessModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Incident Update Successful"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {successMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessModalClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditIncidentForm;
