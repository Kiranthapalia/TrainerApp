import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Snackbar from '@mui/material/Snackbar';
import { format } from 'date-fns';
import AddTraining from "./AddTraining";

function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);

const [columnDefs] = useState([
  { field: "date", sortable: true, filter: true, valueFormatter: params => format(new Date(params.value), 'dd.MM.yyyy HH:mm')},
  { field: "duration", sortable: true, filter: true },
  { field: "activity", sortable: true, filter: true },
  { field: "customer.name", sortable: true, filter: true, headerName: "Customer Name",valueGetter: params => params.data.customer ? `${params.data.customer.firstname} ${params.data.customer.lastname}` : ''
  },
]);


  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    fetch('https://traineeapp.azurewebsites.net/api/trainings')
      .then(response => {
        if (!response.ok)
          throw new Error("Something went wrong" + response.statusText);
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.content)) {
          return Promise.all(data.content.map(training => {
            return fetch(training.links.find(link => link.rel === "customer").href)
              .then(response => response.json())
              .then(customerData => {
                return { ...training, customer: { firstname: customerData.firstname, lastname: customerData.lastname } };
              });
          }));
        } else {
          console.error("Received data does not have a content array:", data);
          return [];
        }
      })
      .then(trainingsWithCustomer => {
        setTrainings(trainingsWithCustomer);
      })
      .catch(err => console.error(err));
  }
  

  

  return (
    <>
    <AddTraining fetchTrainings={fetchTrainings} />
      <div className="ag-theme-material" style={{ width: "90%", height: 600 }}>
        <AgGridReact
          rowData={trainings}
          columnDefs={columnDefs}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Operation successful"
      />
    </>
  );
}

export default TrainingList;
