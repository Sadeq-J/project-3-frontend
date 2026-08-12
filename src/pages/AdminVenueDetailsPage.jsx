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

  if (loading) return <div className="text-center p-10">Loading venue...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!venue) return <div className="text-center p-10">Venue not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{venue.name}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/venues/${id}/edit`)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Edit Venue
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="border border-gray-300 px-4 py-2 rounded"
          >
            Back to Admin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <p><strong>Location:</strong> {venue.location}</p>
        <p><strong>Price:</strong> {venue.pricePerHour} BHD / hour</p>
        <p><strong>Description:</strong> {venue.description || "No description provided"}</p>
        <p><strong>Sports:</strong> {Array.isArray(venue.sportType) ? venue.sportType.join(", ") : venue.sportType}</p>
        <p><strong>Facilities:</strong> {Array.isArray(venue.facilities) && venue.facilities.length > 0 ? venue.facilities.join(", ") : "None"}</p>

        {venue.images && venue.images.length > 0 ? (
          <div>
            <h2 className="font-semibold mb-2">Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {venue.images.filter(Boolean).map((image, index) => (
                <img
                  key={index}
                  src={resolveImageUrl(image)}
                  alt={`${venue.name} ${index + 1}`}
                  className="w-full h-40 object-cover rounded"
                  onError={(event) => {
                    event.target.onerror = null;
                    event.target.src = "https://via.placeholder.com/800x500?text=Venue+Image";
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p>No images uploaded.</p>
        )}
      </div>
    </div>
  );
}

export default AdminVenueDetailsPage;
