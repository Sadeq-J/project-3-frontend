import { useState } from "react";
import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import VenuesPage from "./pages/venuePage";
import VenueDetailsPage from "./pages/venueDetailsPage";
import EditVenuePage from "./pages/Editpage";
import { useEffect } from "react";
import { getCurrentUser, logout } from "./services/authService";
import { getVenues } from "./services/venueService";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

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
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/venues/:venueId" element={<VenueDetailsPage />} />
        <Route path="/venues/:venueId/edit" element={<EditVenuePage />} />
      </Routes>
    </div>
  );
}

export default App;
