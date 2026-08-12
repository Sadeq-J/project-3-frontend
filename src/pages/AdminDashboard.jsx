import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const resolveImageUrl = (image) => {
  const imageUrl = typeof image === "object" && image !== null ? image.url || image.secure_url : image;

  const fallbackSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2364748b'%3ENo Image%3C/text%3E%3C/svg%3E";

  if (typeof imageUrl !== "string" || !imageUrl.trim()) {
    return fallbackSvg;
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${window.location.origin}${imageUrl}`;
  }

  return imageUrl;
};

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

            setUsers(users.map(u => u._id === id ? res.data.user : u));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update role');
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛡️ Admin Control Panel</h2>
            {error && <p className="admin-dashboard-error">{error}</p>}

            <div className="admin-dashboard-tabs">
                <button
                    className={`admin-dashboard-tab${activeTab === 'users' ? ' active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users ({users.length})
                </button>
                <button
                    className={`admin-dashboard-tab${activeTab === 'venues' ? ' active' : ''}`}
                    onClick={() => setActiveTab('venues')}
                >
                    Venues
                </button>
                <button
                    className={`admin-dashboard-tab${activeTab === 'bookings' ? ' active' : ''}`}
                    onClick={() => setActiveTab('bookings')}
                >
                    Bookings
                </button>
            </div>

            <hr className="admin-dashboard-divider" />

            {/* USERS TAB */}
            {activeTab === 'users' && (
                <div>
                    <h3>Manage Users</h3>
                    <ul className="admin-dashboard-list">
                        {users.map(u => (
                            <li key={u._id} className="admin-dashboard-list-item">
                                <span>{u.username} — Admin: {u.isAdmin ? '✅ Yes' : '❌ No'}</span>

                                <div className="admin-dashboard-actions">
                                    <button
                                        className="admin-dashboard-action-btn"
                                        onClick={() => handleToggleAdmin(u._id, u.isAdmin)}
                                    >
                                        {u.isAdmin ? 'Demote to User' : 'Make Admin'}
                                    </button>

                                    <button
                                        className="admin-dashboard-delete-btn"
                                        onClick={() => handleDeleteUser(u._id)}
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
                    <div className="admin-dashboard-venue-header">
                        <h3>Manage Venues</h3>
                        <Link className="admin-dashboard-create-btn" to="/admin/venues/create">Create Venue</Link>
                    </div>
                    <ul className="admin-dashboard-list">
                        {venues.map(venue => {
                            const firstImage = venue.images && venue.images.length > 0 ? venue.images[0] : null;

                            return (
                                <li key={venue._id} className="admin-dashboard-list-item flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={resolveImageUrl(firstImage)}
                                            alt={venue.name}
                                            className="w-12 h-12 object-cover rounded-md border"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2364748b'%3ENo Image%3C/text%3E%3C/svg%3E";
                                            }}
                                        />
                                        <span>
                                            <b>{venue.name}</b> ({Array.isArray(venue.sportType) ? venue.sportType.join(', ') : venue.sportType})
                                        </span>
                                    </div>

                                    <div className="admin-dashboard-actions">
                                        <Link className="admin-dashboard-action-btn" to={`/admin/venues/${venue._id}`}>View</Link>
                                        <Link className="admin-dashboard-action-btn" to={`/admin/venues/${venue._id}/edit`}>Edit</Link>
                                        <button className="admin-dashboard-delete-btn" onClick={() => handleDeleteVenue(venue._id)}>Delete</button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
                <div>
                    <h3>Manage Bookings</h3>
                    <ul className="admin-dashboard-list">
                        {bookings.map(b => (
                            <li key={b._id} className="admin-dashboard-list-item">
                                <span>
                                    <b>{b.venue?.name || 'Venue'}</b> booked by <b>{b.owner?.username || 'Unknown'}</b> on {new Date(b.date).toLocaleDateString()} ({b.timeSlots})
                                </span>
                                <button className="admin-dashboard-delete-btn" onClick={() => handleDeleteBooking(b._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}