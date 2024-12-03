import {React} from "react";
import EditIncidentForm from "./EditIncidentForm";


const EditIncident = ({ incident, onSubmit }) => {
    return (
      <EditIncidentForm
        incidentData={incident}
        onSubmit={(updatedIncident) => onSubmit(updatedIncident)}
      />
    );
  };

export default EditIncident
  