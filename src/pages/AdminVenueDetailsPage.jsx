import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAdminVenueById } from "../services/venueService";

const resolveImageUrl = (image) => {
  if (typeof image !== "string" || !image.trim()) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${window.location.origin}${image}`;
  }

  return image;
};

function AdminVenueDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const data = await getAdminVenueById(id);
        setVenue(data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load venue");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) return <div className="admin-venue-state">Loading venue...</div>;
  if (error) return <div className="admin-venue-state error">{error}</div>;
  if (!venue) return <div className="admin-venue-state">Venue not found.</div>;

  const sportList = Array.isArray(venue.sportType) ? venue.sportType : [venue.sportType];
  const facilityList = Array.isArray(venue.facilities) ? venue.facilities : [];

  return (
    <div className="admin-venue-page">
      <div className="admin-venue-shell">
        <div className="admin-venue-header">
          <div>
            <p className="admin-venue-kicker">Venue overview</p>
            <h1>{venue.name}</h1>
          </div>

          <div className="admin-venue-header-actions">
            <button type="button" onClick={() => navigate(`/admin/venues/${id}/edit`)} className="admin-venue-btn primary">
              Edit venue
            </button>
            <button type="button" onClick={() => navigate("/admin")} className="admin-venue-btn secondary">
              Back to admin
            </button>
          </div>
        </div>

        <div className="admin-venue-grid">
          <div className="admin-venue-card">
            <div className="admin-venue-badges">
              <span className="admin-venue-badge">{venue.location}</span>
              <span className="admin-venue-badge accent">{venue.pricePerHour} BHD / hr</span>
            </div>

            <div className="admin-venue-meta-block">
              <h2>Overview</h2>
              <p>{venue.description || "No description provided for this venue yet."}</p>
            </div>

            <div className="admin-venue-meta-grid">
              <div>
                <p className="admin-venue-label">Sports</p>
                <div className="admin-venue-tags">
                  {sportList.filter(Boolean).map((sport, index) => (
                    <span key={index} className="admin-venue-tag">{sport}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="admin-venue-label">Facilities</p>
                <div className="admin-venue-tags">
                  {facilityList.length > 0 ? facilityList.map((facility, index) => (
                    <span key={index} className="admin-venue-tag muted">{facility}</span>
                  )) : <span className="admin-venue-tag muted">None added</span>}
                </div>
              </div>
            </div>
          </div>

          <aside className="admin-venue-summary">
            <p className="admin-venue-summary-title">Quick facts</p>
            <div className="admin-venue-summary-row">
              <span>Location</span>
              <strong>{venue.location}</strong>
            </div>
            <div className="admin-venue-summary-row">
              <span>Pricing</span>
              <strong>{venue.pricePerHour} BHD</strong>
            </div>
            <div className="admin-venue-summary-row">
              <span>Sports</span>
              <strong>{sportList.filter(Boolean).length}</strong>
            </div>
            <div className="admin-venue-summary-row">
              <span>Facilities</span>
              <strong>{facilityList.length}</strong>
            </div>
            <Link to="/admin" className="admin-venue-link">Back to dashboard</Link>
          </aside>
        </div>

        {venue.images && venue.images.length > 0 ? (
          <div className="admin-venue-gallery-block">
            <div className="admin-venue-gallery-header">
              <h2>Venue gallery</h2>
            </div>
            <div className="admin-venue-gallery-grid">
              {venue.images.filter(Boolean).map((image, index) => (
                <img
                  key={index}
                  src={resolveImageUrl(image)}
                  alt={`${venue.name} ${index + 1}`}
                  className="admin-venue-gallery-image"
                  onError={(event) => {
                    event.target.onerror = null;
                    event.target.src = "https://via.placeholder.com/800x500?text=Venue+Image";
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-venue-empty">No images uploaded for this venue.</div>
        )}
      </div>
    </div>
  );
}

export default AdminVenueDetailsPage;
