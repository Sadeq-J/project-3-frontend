import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVenues } from "../services/venueService";

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

function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [sportType, setSportType] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVenues = async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {};

      if (sportType) {
        filters.sportType = sportType;
      }

      if (location) {
        filters.location = location;
      }

      if (minPrice) {
        filters.minPrice = minPrice;
      }

      if (maxPrice) {
        filters.maxPrice = maxPrice;
      }

      const data = await getVenues(filters);

      setVenues(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, [sportType, location, minPrice, maxPrice]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Sports Venues</h1>

          <p className="text-gray-600 mt-2">
            Find the perfect sports venue in Bahrain.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Find a Venue</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={sportType}
              onChange={(e) => setSportType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="">All Sports</option>
              <option value="football">Football</option>
              <option value="padel">Padel</option>
              <option value="basketball">Basketball</option>
              <option value="tennis">Tennis</option>
              <option value="swimming">Swimming</option>
            </select>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="">All Locations</option>
              <option value="Saar">Saar</option>
              <option value="Seef">Seef</option>
              <option value="Amwaj">Amwaj</option>
            </select>

            <input
              type="number"
              placeholder="Minimum price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
            />

            <input
              type="number"
              placeholder="Maximum price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-600">Loading venues...</p>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && venues.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No venues found.</p>
          </div>
        )}

        {!loading && venues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                {venue.images && venue.images.length > 0 ? (
                  <div className="w-full h-52 overflow-hidden bg-gray-100">
                    <img
                      src={resolveImageUrl(venue.images[0])}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                      onLoad={() => console.log("image loaded", venue.name, resolveImageUrl(venue.images[0]))}
                      onError={(event) => {
                        event.target.onerror = null;
                        event.target.src = "https://via.placeholder.com/800x500?text=Venue+Image";
                        console.error("image failed", venue.name, resolveImageUrl(venue.images[0]));
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-2xl font-bold">{venue.name}</h2>

                  <p className="text-gray-600 mt-2">📍 {venue.location}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {venue.sportType.map((sport, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>

                  <p className="font-semibold text-lg mt-4">
                    {venue.pricePerHour} BHD / hour
                  </p>

                  <Link
                    to={`/venues/${venue._id}`}
                    className="block text-center bg-black text-white py-3 rounded-lg mt-5 hover:bg-gray-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VenuesPage;
