import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import AddCustomer from "./Addcustomers";
import EditCustomer from "./EditCustomers";

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);

    const [columnDefs] = useState([
        { field: "firstname", sortable: true, filter: true },
        { field: "lastname", sortable: true, filter: true },
        { field: "streetaddress", sortable: true, filter: true },
        { field: "postcode", sortable: true, filter: true },
        { field: "city", sortable: true, filter: true },
        { field: "email", sortable: true, filter: true },
        { field: "phone", sortable: true, filter: true },
        {
            cellRenderer: params => <EditCustomer customerData={params.data} fetchCustomers={fetchCustomers} />,
            width: 120
        },
        {
            cellRenderer: params => {
                const deleteUrl = params.data.links.find(link => link.rel === "customer" || link.rel === "self").href;
                return <Button size="small" onClick={() => deleteCustomer(deleteUrl)}>Delete</Button>;
            },
            width: 200
        }
        
    ]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const deleteCustomer = (url) => {
        if (window.confirm('Are you sure?')) {
            fetch(url, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error in delete: ' + response.statusText);
                    }
                    setOpen(true);
                    fetchCustomers();
                })
                .catch(err => console.error(err));
        }
    };

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
    

    return (
        <>
         <AddCustomer fetchCustomers={fetchCustomers} />
         <div className="ag-theme-material" style={{ width: "90%", height: 600 }}>
                <AgGridReact
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
