import { useEffect, useMemo, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
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

      if (searchTerm.trim()) filters.search = searchTerm.trim();
      if (sportType) filters.sportType = sportType;
      if (location) filters.location = location;
      if (minPrice) filters.minPrice = minPrice;
      if (maxPrice) filters.maxPrice = maxPrice;

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

  const filteredVenues = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return venues.filter((venue) => {
      if (!term) return true;

      const searchable = [
        venue.name,
        venue.location,
        Array.isArray(venue.sportType) ? venue.sportType.join(" ") : venue.sportType,
        venue.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [venues, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
    setSportType("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">MAIDAN</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Sports venues</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-sm font-medium text-slate-600">{filteredVenues.length}</span>
            <span className="text-sm text-slate-400">results</span>
          </div>
        </div>

        <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, sport, location..."
                className="field-input pl-11"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            </div>

            <select value={sportType} onChange={(e) => setSportType(e.target.value)} className="field-input">
              <option value="">All sports</option>
              <option value="football">Football</option>
              <option value="padel">Padel</option>
              <option value="basketball">Basketball</option>
              <option value="tennis">Tennis</option>
              <option value="swimming">Swimming</option>
            </select>

            <select value={location} onChange={(e) => setLocation(e.target.value)} className="field-input">
              <option value="">All locations</option>
              <option value="Saar">Saar</option>
              <option value="Seef">Seef</option>
              <option value="Amwaj">Amwaj</option>
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="field-input"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="field-input"
            />

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {searchTerm || sportType || location || minPrice || maxPrice ? "Filters active" : "Showing all venues"}
            </div>

            <button type="button" onClick={clearFilters} className="secondary-button justify-center">
              Clear filters
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-slate-600">Loading venues...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && filteredVenues.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white py-14 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-800">No venues match your search.</p>
            <p className="mt-2 text-sm text-slate-500">Try a different name, sport, or price range.</p>
          </div>
        )}

        {!loading && filteredVenues.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredVenues.map((venue) => (
              <article key={venue._id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  {venue.images && venue.images.length > 0 ? (
                    <img src={resolveImageUrl(venue.images[0])} alt={venue.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-sm font-medium text-slate-500">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/75 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                    {venue.location}
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{venue.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{Array.isArray(venue.sportType) ? venue.sportType.join(" • ") : venue.sportType}</p>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {venue.pricePerHour} BHD
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">{venue.description || "Premium venue with fast booking, excellent facilities, and a smooth match-day experience."}</p>

                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(venue.sportType) ? venue.sportType.slice(0, 3).map((sport, index) => (
                      <span key={index} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {sport}
                      </span>
                    )) : null}
                  </div>

                  <Link to={`/venues/${venue._id}`} className="primary-button mt-2 w-full">
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VenuesPage;
