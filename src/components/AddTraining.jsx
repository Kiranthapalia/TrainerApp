import { useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';

function AddTraining({ fetchTrainings, customer }) {
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [newTraining, setNewTraining] = useState({
    date: '',
    duration: '',
    activity: '',
    customer: ''
  });

  const handleClickOpen = () => {
    console.log('Received customer prop:', customer);
    setOpen(true);
    setNewTraining({ ...newTraining, customer: customer.links[0].href });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setNewTraining({ ...newTraining, [event.target.name]: event.target.value });
  };

  const handleSave = () => {
    const formattedTraining = {
      ...newTraining,
      date: dayjs(newTraining.date).toISOString(), // Formatting date to ISO-8601
    };

    fetch('https://traineeapp.azurewebsites.net/api/trainings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedTraining)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add training: ' + response.statusText);
      }
      setOpenSnackbar(true);
      fetchTrainings();
    })
    .catch(err => {
      console.error(err);
    });

    handleClose();
    setNewTraining({
      date: '',
      duration: '',
      activity: '',
      customer: ''
    });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-start" marginTop={1} marginBottom={2}>
        <Button color="primary" onClick={handleClickOpen} startIcon={<AddIcon />}>
         
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Training</DialogTitle>
        <DialogContent>
          <TextField 
            name="date"
            label="Date"
            type="datetime-local"
            value={newTraining.date}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField 
            name="duration"
            label="Duration (minutes)"
            type="number"
            value={newTraining.duration}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField 
            name="activity"
            label="Activity"
            value={newTraining.activity}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
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
        message="Training added successfully"
      />
    </>
  );
}

export default AddTraining;
