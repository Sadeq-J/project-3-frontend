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
    return <div className="p-10 text-center text-slate-600">Loading venue...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!venue) {
    return <div className="p-10 text-center text-slate-600">Venue not found.</div>;
  }

  const images = (() => {
    const rawImages = Array.isArray(venue.images)
      ? venue.images
      : typeof venue.images === "string"
        ? [venue.images]
        : [];

    return rawImages.filter(Boolean).map(resolveImageUrl).filter(Boolean);
  })();

  const nextImage = () => {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const hasMultipleImages = images.length > 1;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
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

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Featured venue</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900">{venue.name}</h1>
            <p className="mt-3 text-lg text-slate-600">📍 {venue.location}</p>

            {venue.description && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900">Description</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">{venue.description}</p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">Sports</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Array.isArray(venue.sportType) ? venue.sportType : [venue.sportType]).map((sport, index) => (
                  <span key={index} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                    {sport}
                  </span>
                ))}
              </div>
            </div>

            {venue.facilities && venue.facilities.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900">Facilities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {venue.facilities.map((facility, index) => (
                    <span key={index} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Booking</p>
            <p className="mt-4 text-4xl font-black text-slate-900">{venue.pricePerHour} BHD</p>
            <p className="mt-1 text-sm text-slate-500">per hour</p>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
                <span>Location</span>
                <span className="font-semibold text-slate-800">{venue.location}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
                <span>Sports</span>
                <span className="font-semibold text-slate-800">{Array.isArray(venue.sportType) ? venue.sportType.length : 1}</span>
              </div>
            </div>

            <button onClick={() => navigate(`/venues/bookings/${venue._id}`)} className="primary-button mt-8 w-full">
              Book this venue
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default VenueDetailsPage;
