import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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
        setError(err.response?.data?.error || "Failed to load venue details");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">Loading venue details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <p className="text-base font-semibold text-red-800">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="secondary-button mt-4 border-red-200 text-red-700 hover:bg-red-100"
          >
            ← Return to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <div className="panel-surface p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Venue Not Found</h2>
          <p className="mt-2 text-sm text-slate-500">The requested venue could not be found or has been removed.</p>
          <button type="button" onClick={() => navigate("/admin")} className="primary-button mt-6">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sportList = Array.isArray(venue.sportType) ? venue.sportType : [venue.sportType];
  const facilityList = Array.isArray(venue.facilities) ? venue.facilities : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-600 ring-1 ring-slate-200">
              Admin Inspection
            </span>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-slate-900 sm:text-4xl">
              {venue.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/venues/${id}`)}
              className="secondary-button"
            >
              Public View ↗
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/venues/${id}/edit`)}
              className="primary-button"
            >
              Edit Venue
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="secondary-button"
            >
              Back to Admin
            </button>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.5fr_0.9fr]">
          {/* Main Details */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700">
                📍 {venue.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
                💰 {venue.pricePerHour} BHD / hr
              </span>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Overview & Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                {venue.description || "No description provided for this venue yet."}
              </p>
            </div>

            {/* Sports & Facilities */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Sports */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Supported Sports</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sportList.filter(Boolean).map((sport, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-700/10"
                    >
                      ⚽ {sport}
                    </span>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Facilities & Amenities</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {facilityList.length > 0 ? (
                    facilityList.map((facility, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                      >
                        ✓ {facility}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs italic text-slate-400">No facilities listed</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Facts Sidebar */}
          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
            <h3 className="border-b border-slate-200 pb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Venue Quick Facts
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-200/60 py-1.5">
                <span className="font-medium text-slate-500">Location</span>
                <span className="font-bold text-slate-900">{venue.location}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 py-1.5">
                <span className="font-medium text-slate-500">Rate / Hour</span>
                <span className="font-bold text-emerald-600">{venue.pricePerHour} BHD</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 py-1.5">
                <span className="font-medium text-slate-500">Total Sports</span>
                <span className="font-bold text-slate-900">{sportList.filter(Boolean).length}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 py-1.5">
                <span className="font-medium text-slate-500">Total Facilities</span>
                <span className="font-bold text-slate-900">{facilityList.length}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-medium text-slate-500">Images Uploaded</span>
                <span className="font-bold text-slate-900">{venue.images?.length || 0}</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/admin"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100"
              >
                ← Return to Admin Dashboard
              </Link>
            </div>
          </aside>
        </div>

        {/* Venue Gallery */}
        <div className="border-t border-slate-200 bg-slate-50/40 px-6 py-8 sm:px-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Venue Gallery</h2>
            <span className="rounded-full bg-slate-200/80 px-3 py-1 text-xs font-bold text-slate-700">
              {venue.images?.filter(Boolean).length || 0} Photos
            </span>
          </div>

          {venue.images && venue.images.filter(Boolean).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {venue.images.filter(Boolean).map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                  <img
                    src={resolveImageUrl(image)}
                    alt={`${venue.name} ${index + 1}`}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(event) => {
                      event.target.onerror = null;
                      event.target.src = "https://via.placeholder.com/800x500?text=Venue+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/10" />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-500">
              No photos uploaded for this venue yet. Edit venue to add images.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminVenueDetailsPage;
