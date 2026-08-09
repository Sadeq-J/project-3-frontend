import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getVenueById } from "../services/venueService";

function VenueDetailsPage() {
  const { venueId } = useParams();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const data = await getVenueById(venueId);
        setVenue(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  if (loading) {
    return <div>Loading venue...</div>;
  }

  if (!venue) {
    return <div>Venue not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow overflow-hidden">
        {venue.images && venue.images.length > 0 ? (
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="w-full h-80 object-cover"
          />
        ) : (
          <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        <div className="p-8">
          <h1 className="text-4xl font-bold">{venue.name}</h1>

          <p className="text-gray-600 text-lg mt-3">📍 {venue.location}</p>

          <p className="text-gray-600 mt-4">{venue.description}</p>
        </div>
      </div>
    </div>
  );
}

export default VenueDetailsPage;
