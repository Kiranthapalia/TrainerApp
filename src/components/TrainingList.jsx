import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Snackbar from '@mui/material/Snackbar';
import dayjs from 'dayjs';
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);

const [columnDefs] = useState([
  { field: "date", sortable: true, filter: true, valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm')},  
  { field: "duration", sortable: true, filter: true },
  { field: "activity", sortable: true, filter: true },
  { field: "customer.name", sortable: true, filter: true, headerName: "Customer Name",valueGetter: params => params.data.customer ? `${params.data.customer.firstname} ${params.data.customer.lastname}` : ''},
  { headerName: '',field: 'actions',
    cellRenderer: params => (
      <Button size="small"onClick={() => handleDeleteTraining(params.data)} startIcon={<DeleteIcon />}></Button>),
      filter: false, sortable: false, width: 150
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
  
  const handleDeleteTraining = (trainingData) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this training?');
    if (confirmDelete) {
      const deleteUrl = trainingData.links.find(link => link.rel === "self").href;
      fetch(deleteUrl, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error in delete: ' + response.statusText);
          }
          setOpen(true); 
          fetchTrainings(); 
        })
        .catch(err => {
          console.error(err);
          alert('Failed to delete training');
        });
    }
  };

  return (
    <>
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
        autoHideDuration={8000}
        onClose={() => setOpen(false)}
        message="Operation successful"
      />
    </>
  );
}

export default TrainingList;
