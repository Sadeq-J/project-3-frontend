import { useState, useEffect } from 'react';
import API from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    try {
      setError('');
      if (tab === 'users') {
        const res = await API.get('/admin/users');
        setUsers(res.data);
      } else if (tab === 'venues') {
        const res = await API.get('/admin/venues');
        setVenues(res.data);
      } else if (tab === 'bookings') {
        const res = await API.get('/admin/bookings');
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleDeleteVenue = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;
    try {
      await API.delete(`/admin/venues/${id}`);
      setVenues(venues.filter(v => v._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete venue');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await API.delete(`/admin/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete booking');
    }
  };

  const handleToggleAdmin = async (id, currentAdminStatus) => {
    try {
      const res = await API.patch(`/admin/users/${id}/role`, { 
        isAdmin: !currentAdminStatus 
      });
      
      // Update the state so the UI changes immediately without refreshing
      setUsers(users.map(u => u._id === id ? res.data.user : u));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update role');
    }
  }

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>🛡️ Admin Control Panel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setActiveTab('users')} style={{ fontWeight: activeTab === 'users' ? 'bold' : 'normal' }}>
          Users ({users.length})
        </button>
        <button onClick={() => setActiveTab('venues')} style={{ fontWeight: activeTab === 'venues' ? 'bold' : 'normal' }}>
          Venues
        </button>
        <button onClick={() => setActiveTab('bookings')} style={{ fontWeight: activeTab === 'bookings' ? 'bold' : 'normal' }}>
          Bookings
        </button>
      </div>

      <hr style={{ marginBottom: '20px' }} />

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div>
          <h3>Manage Users</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map(u => (
              <li key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>
                <span>{u.username} — Admin: {u.isAdmin ? '✅ Yes' : '❌ No'}</span>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  {/* 🔥 New Promote/Demote Button */}
                  <button 
                    onClick={() => handleToggleAdmin(u._id, u.isAdmin)}
                    style={{ cursor: 'pointer', background: '#f0f0f0', border: '1px solid #ccc', padding: '4px 8px', borderRadius: '4px' }}
                  >
                    {u.isAdmin ? 'Demote to User' : 'Make Admin'}
                  </button>

                  <button 
                    onClick={() => handleDeleteUser(u._id)} 
                    style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* VENUES TAB */}
      {activeTab === 'venues' && (
        <div>
          <h3>Manage Venues</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {venues.map(v => (
              <li key={v._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd' }}>
                <span>{v.name} ({Array.isArray(v.sportType) ? v.sportType.join(', ') : v.sportType})</span>
                <button onClick={() => handleDeleteVenue(v._id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div>
          <h3>Manage Bookings</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bookings.map(b => (
              <li key={b._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd' }}>
                <span>
                  <b>{b.venue?.name || 'Venue'}</b> booked by <b>{b.owner?.username || 'Unknown'}</b> on {new Date(b.date).toLocaleDateString()} ({b.timeSlots})
                </span>
                <button onClick={() => handleDeleteBooking(b._id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}