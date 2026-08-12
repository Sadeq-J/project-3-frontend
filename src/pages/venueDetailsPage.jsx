import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVenueById } from "../services/venueService";

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

function VenueDetailsPage() {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);

        const data = await getVenueById(venueId);

        setVenue(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load venue");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [venueId]);

  if (loading) {
    return <div className="text-center p-10">Loading venue...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!venue) {
    return <div className="text-center p-10">Venue not found.</div>;
  }

  const images = Array.isArray(venue.images) && venue.images.length > 0
    ? venue.images.filter(Boolean).map(resolveImageUrl)
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow overflow-hidden">
        {images.length > 0 ? (
          <div className="carousel-container">
            <img
              src={images[activeImageIndex]}
              alt={`${venue.name} ${activeImageIndex + 1}`}
              className="carousel-image"
              onError={(event) => {
                event.target.onerror = null;
                event.target.src = "https://via.placeholder.com/800x500?text=Venue+Image";
              }}
            />

            {images.length > 1 && (
              <div className="carousel-controls">
                <button
                  type="button"
                  className="carousel-button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                >
                  ←
                </button>
                <div className="carousel-dots">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`carousel-dot${index === activeImageIndex ? " active" : ""}`}
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="carousel-button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        <div className="p-8">
          <h1 className="text-4xl font-bold">{venue.name}</h1>

          <p className="text-gray-600 text-lg mt-3">📍 {venue.location}</p>

          {venue.description && (
            <div className="mt-6">
              <h2 className="text-xl font-bold">Description</h2>

              <p className="text-gray-600 mt-2">{venue.description}</p>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-bold">Sports</h2>

            <div className="flex flex-wrap gap-2 mt-3">
              {venue.sportType.map((sport, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-4 py-2 rounded-full"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {venue.facilities && venue.facilities.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold">Facilities</h2>

              <div className="flex flex-wrap gap-2 mt-3">
                {venue.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-4 py-2 rounded-full"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <p className="text-2xl font-bold">
              {venue.pricePerHour} BHD / hour
            </p>
          </div>

          <button
            onClick={() => navigate(`/bookings/${venue._id}`)}
            className="w-full bg-black text-white py-4 rounded-lg mt-6 text-lg font-semibold hover:bg-gray-800"
          >
            Book This Venue
          </button>
        </div>
      </div>
    </div>
  );
}

export default VenueDetailsPage;
