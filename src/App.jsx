import { useState, useEffect } from 'react';
import { AppBar, Button, Toolbar, IconButton, Typography, Drawer, List, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './App.css'
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import Calendar from './components/Calendar';
import { fetchCustomers } from './components/Fetch';
import StatisticsPage from './components/Stats';

function App() {
  const [currentPage, setCurrentPage] = useState('customers');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [customers, setCustomers] = useState([]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
    <List>
  {['Customers', 'Trainings', 'Calendar', 'Statistics'].map((text) => ( 
    <Button 
      key={text} 
      onClick={() => setCurrentPage(text.toLowerCase())} 
      style={{ 
        justifyContent: 'flex-start', 
        textAlign: 'left', 
        width: '100%', 
        textTransform: 'none'  
      }}
    >
    {text}
    </Button>
))}
</List>
    </div>
  );

  

  useEffect(() => {
    const fetchData = async () => {
      const customersData =  fetchCustomers();
      setCustomers(customersData);  
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="xl">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Personal Trainer App</Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>

      <div>
        {currentPage === 'customers' && <CustomerList />}
        {currentPage === 'trainings' && <TrainingList customers={customers} fetchCustomers={fetchCustomers}/>}
        {currentPage === 'calendar' && <Calendar />}
        {currentPage === 'statistics' && <StatisticsPage />}
      </div>
    </Container>
  );
}

export default App;
