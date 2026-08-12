import { Route, Routes } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import VenuesPage from "./pages/venuePage";
import VenueDetailsPage from "./pages/venueDetailsPage";
import MyProfilePage from "./pages/profiles/MyProfilePage"
import BookingPage from "./pages/BookingPage"
import CreateVenuePage from "./pages/createPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import ProfileDetailsPage from "./pages/profiles/ProfileDetailsPage";
import { useEffect } from "react";
import { getCurrentUser, logout } from "./services/authService";
import { getVenues } from "./services/venueService";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute"
import AdminDashboard from "./pages/AdminDashboard";
import EditVenuePage from "./pages/Editpage"
import CreateVenuePage from "./pages/createPage"
import AdminVenueDetailsPage from "./pages/AdminVenueDetailsPage"

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/venues/bookings/:id"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfileDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/venues/:venueId" element={<VenueDetailsPage />} />
        <Route path="/venues/create" element={<CreateVenuePage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/venues/create"
          element={
            <AdminRoute>
              <CreateVenuePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/venues/:id"
          element={
            <AdminRoute>
              <AdminVenueDetailsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/venues/:venueId/edit"
          element={
            <AdminRoute>
              <EditVenuePage />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
