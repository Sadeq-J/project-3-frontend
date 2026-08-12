import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import maidanLogo from "../assets/maidan-logo.svg";

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
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    try {
      setError("");
      if (tab === "users") {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } else if (tab === "venues") {
        const res = await API.get("/admin/venues");
        setVenues(res.data);
      } else if (tab === "bookings") {
        const res = await API.get("/admin/bookings");
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return [user.username, user.email].filter(Boolean).some((value) => value.toLowerCase().includes(term));
  });

  const filteredVenues = venues.filter((venue) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const searchable = [
      venue.name,
      venue.location,
      Array.isArray(venue.sportType) ? venue.sportType.join(" ") : venue.sportType,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(term);
  });

  const filteredBookings = bookings.filter((booking) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const searchable = [
      booking.venue?.name,
      booking.owner?.username,
      booking.status,
      booking.timeSlots,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(term);
  });

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  const handleDeleteVenue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    try {
      await API.delete(`/admin/venues/${id}`);
      setVenues(venues.filter((v) => v._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete venue");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await API.delete(`/admin/bookings/${id}`);
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete booking");
    }
  };

  const handleToggleAdmin = async (id, currentAdminStatus) => {
    try {
      const res = await API.patch(`/admin/users/${id}/role`, {
        isAdmin: !currentAdminStatus,
      });

      setUsers(users.map((u) => (u._id === id ? res.data.user : u)));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update role");
    }
  };

  const tabs = [
    { key: "users", label: "Users", count: users.length },
    { key: "venues", label: "Venues", count: venues.length },
    { key: "bookings", label: "Bookings", count: bookings.length },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-4">
          <img src={maidanLogo} alt="MAIDAN logo" className="h-14 w-auto rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Operations center</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.07em] text-slate-900 sm:text-4xl">MAIDAN admin dashboard</h1>
          </div>
        </div>

        <div className="relative w-full max-w-md">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search users, venues, bookings..."
            className="field-input pl-11"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === tab.key ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === "users" && (
        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold tracking-[-0.04em] text-slate-900">Manage users</h2>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user._id} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[minmax(0,1.4fr)_auto_auto] md:items-center">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {(user.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-slate-900">{user.username}</p>
                    <p className="mt-1 text-sm text-slate-500">{user.email || "No email provided"}</p>
                  </div>
                </div>

                <span className={`inline-flex w-fit items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] ${user.isAdmin ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                  {user.isAdmin ? "Admin" : "User"}
                </span>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button type="button" className="primary-button" onClick={() => handleToggleAdmin(user._id, user.isAdmin)}>
                    {user.isAdmin ? "Demote" : "Promote"}
                  </button>
                  <button type="button" className="secondary-button border-red-200 bg-red-50 text-red-700 hover:bg-red-100" onClick={() => handleDeleteUser(user._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "venues" && (
        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold tracking-[-0.04em] text-slate-900">Manage venues</h2>
            <Link className="primary-button" to="/admin/venues/create">Create venue</Link>
          </div>

          <div className="space-y-3">
            {filteredVenues.map((venue) => {
              const firstImage = venue.images && venue.images.length > 0 ? venue.images[0] : null;

              return (
                <div key={venue._id} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[minmax(0,1.5fr)_auto_auto] md:items-center">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-200">
                      <img
                        src={resolveImageUrl(firstImage)}
                        alt={venue.name}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.target.onerror = null;
                          event.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2364748b'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-slate-900">{venue.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{venue.location}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(venue.sportType) ? venue.sportType : [venue.sportType]).filter(Boolean).slice(0, 2).map((sport, index) => (
                      <span key={`${sport}-${index}`} className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        {sport}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link className="secondary-button" to={`/admin/venues/${venue._id}`}>View</Link>
                    <Link className="secondary-button" to={`/admin/venues/${venue._id}/edit`}>Edit</Link>
                    <button type="button" className="secondary-button border-red-200 bg-red-50 text-red-700 hover:bg-red-100" onClick={() => handleDeleteVenue(venue._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "bookings" && (
        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold tracking-[-0.04em] text-slate-900">Manage bookings</h2>
          </div>

          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[minmax(0,1.4fr)_auto_auto] md:items-center">
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900">{booking.venue?.name || "Unknown venue"}</p>
                  <p className="mt-1 text-sm text-slate-500">Booked by {booking.owner?.username || "Unknown user"} • {booking.timeSlots}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left md:text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Date</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{new Date(booking.date).toLocaleDateString()}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{booking.status || "Confirmed"}</p>
                </div>

                <button type="button" className="secondary-button border-red-200 bg-red-50 text-red-700 hover:bg-red-100" onClick={() => handleDeleteBooking(booking._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
