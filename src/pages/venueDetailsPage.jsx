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
    <div>
      <h1>{venue.name}</h1>
      <p>{venue.location}</p>
      <p>{venue.description}</p>
    </div>
  );
}

export default VenueDetailsPage;
