import { useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar } from '@mui/material';

function AddCustomer({ fetchCustomers }) {
  const [newCustomer, setNewCustomer] = useState({
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: ''
  });
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setNewCustomer({ ...newCustomer, [event.target.name]: event.target.value });
  };

  const handleSave = () => {
    fetch('https://traineeapp.azurewebsites.net/api/customers', {
      method: 'POST',
      headers: { 'Content-type':'application/json' },
      body: JSON.stringify(newCustomer)
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Addition Failed:' + response.statusText);
      }
      setOpenSnackbar(true);
      fetchCustomers();
    })
    .catch(err => {
      console.error(err);
    });

    handleClose();
    setNewCustomer({ 
      firstname: '',
      lastname: '',
      streetaddress: '',
      postcode: '',
      city: '',
      email: '',
      phone: ''
    });
  };

  return (
    <>
        <Box display="flex" justifyContent="flex-start" marginTop={4} marginBottom={2}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Add Customer
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Customer</DialogTitle>
        <DialogContent>
          <TextField name="firstname" label="First Name" value={newCustomer.firstname} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="lastname" label="Last Name" value={newCustomer.lastname} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="streetaddress" label="Street Address" value={newCustomer.streetaddress} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="postcode" label="Postcode" value={newCustomer.postcode} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="city" label="City" value={newCustomer.city} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="email" label="Email" value={newCustomer.email} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="phone" label="Phone" value={newCustomer.phone} onChange={handleChange} fullWidth margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Customer added successfully"
      />
    </>
  );
}

export default AddCustomer;
