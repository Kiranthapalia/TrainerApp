import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import AddCustomer from "./Addcustomers";
import EditCustomer from "./EditCustomers";
import AddTraining from "./AddTraining";
import DeleteIcon from '@mui/icons-material/Delete';


function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const gridRef = useRef();

    useEffect(() => {
     fetchCustomers()
    }, []);

    const fetchCustomers = () => {
      fetch('https://traineeapp.azurewebsites.net/api/customers')
          .then(response => {
              if (!response.ok)
                  throw new Error("Something went wrong" + response.statusText);
              return response.json();
          })
          .then(data => {
              if (data && Array.isArray(data.content)) {
                  setCustomers(data.content);
              } else {
                  console.error("Received data does not have a content array:", data);
                  // Handle cases where data does not have a 'content' array
              }
          })
          .catch(err => console.error(err));
     }
  
    const exportToCSV = () => {
      gridRef.current.api.exportDataAsCsv({
        fileName: 'customers.csv',
        columnKeys: ['firstname', 'lastname', 'streetaddress', 'postcode', 'city', 'email', 'phone'],
      });
    };

    const deleteCustomer = async (url) => {
      if (window.confirm('Are you sure?')) {
        try {
          const response = await fetch(url.replace("http:", "https:"), { method: 'DELETE' });
          if (!response.ok) throw new Error('Error in delete: ' + response.statusText);
          setOpen(true);
          fetchCustomers();
        } catch (error) {
          console.error(error);
          setOpen(true);
        }
      }
    };

    const [columnDefs] = useState([
        { field: "firstname", sortable: true, filter: true, width: 150 },
        { field: "lastname", sortable: true, filter: true, width: 150 },
        { field: "streetaddress", sortable: true, filter: true, width: 185 },
        { field: "postcode", sortable: true, filter: true, width: 150 },
        { field: "city", sortable: true, filter: true, width: 155 },
        { field: "email", sortable: true, filter: true, width: 185 },
        { field: "phone", sortable: true, filter: true, width: 150 },
        {
          headerName: "",
          field: "addTraining",
          cellRenderer: (params) => (
            <AddTraining 
              customer={params.data} 
              fetchTrainings={fetchCustomers} />
          ),
          filter: false, 
          sortable: false, 
          width: 100
        },
        {
            cellRenderer: params => <EditCustomer customerData={params.data} fetchCustomers={fetchCustomers} />,
            width: 125
        },
        {
            cellRenderer: params => {
                const deleteUrl = params.data.links.find(link => link.rel === "customer" || link.rel === "self").href;
                return <Button size="small" onClick={() => deleteCustomer(deleteUrl)} startIcon={<DeleteIcon />}></Button>;
            }, width: 125
        }    
    ]);
    
    return (
        <>
         <AddCustomer fetchCustomers={fetchCustomers} />
         <div className="ag-theme-material" style={{ width: "100%", height: 600 }}>
         <Button onClick={exportToCSV}>Export to CSV</Button>
                <AgGridReact
                    ref={gridRef}
                    rowData={customers}
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

export default CustomerList;