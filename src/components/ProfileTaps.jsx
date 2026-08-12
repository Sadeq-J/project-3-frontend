import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {getMyBookings} from '../services/bookingService'
import {useNavigate} from 'react-router'

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [bookings, setBookings] = React.useState([])

    const navigate = useNavigate()
  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getMyBookings()
        setBookings(response)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }

    fetchBookings()
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Bookings" {...a11yProps(0)} />
          <Tab label="Favorites" {...a11yProps(1)} />
          <Tab label="Reviews" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        Bookings
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
            bookings.map((oneBooking) => (
              <div key={oneBooking._id} onClick={() => navigate(`/bookings/${oneBooking._id}`)}>
                <p>Venue: {oneBooking.venue.name}</p>
                <p>Booking Date: {new Date(oneBooking.date).toLocaleDateString()}</p>
                <p>Booking Time: {new Date(oneBooking.date).toLocaleTimeString()}</p>
                <p>Booking Status: {oneBooking.status}</p>
                <hr />
              </div>
            ))
          )
        }
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        Favorites
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}