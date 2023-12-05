import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function EditCustomer({ customerData, fetchCustomers }) {
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

  const handleClickOpen = () => {
    setNewCustomer({
      firstname: customerData.firstname,
      lastname: customerData.lastname,
      streetaddress: customerData.streetaddress,
      postcode: customerData.postcode,
      city: customerData.city,
      email: customerData.email,
      phone: customerData.phone
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setNewCustomer({ ...newCustomer, [event.target.name]: event.target.value });
  };

  const handleSave = () => {

    const customerUrl = customerData.links.find(link => link.rel === "customer" || link.rel === "self").href;

    fetch(customerUrl, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(newCustomer)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error in edit: ' + response.statusText);
      } else {
        setOpen(false)
        fetchCustomers();
        console.log('customer', response.url)
      }
    })
    .catch(err => console.error(err));

    handleClose();
  };

  return (
    <>
      <Button size="small" onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Customer</DialogTitle>
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
    </>
  );
}