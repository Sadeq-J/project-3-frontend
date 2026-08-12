import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMyBookings } from "../services/bookingService";

const tabs = ["Bookings", "Favorites", "Reviews"];

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await getMyBookings();
        setBookings(response);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-3">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            onClick={() => setValue(index)}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
              value === index
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        {value === 0 && (
          <div className="space-y-4">
            {loading ? (
              <p className="py-5 text-sm text-slate-500">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="py-5 text-sm text-slate-500">No bookings found.</p>
            ) : (
              bookings.map((oneBooking) => (
                <button
                  key={oneBooking._id}
                  type="button"
                  onClick={() => navigate(`/bookings/${oneBooking._id}`)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition-all duration-200 hover:border-slate-300 hover:bg-white"
                >
                  <p className="text-base font-bold text-slate-900">{oneBooking.venue?.name || "Venue"}</p>
                  <div className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
                    <p>Booking Date: {new Date(oneBooking.date).toLocaleDateString()}</p>
                    <p>Time: {oneBooking.timeSlots || "-"}</p>
                    <p>Status: {oneBooking.status}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {value === 1 && <p className="text-sm text-slate-500">Favorites coming soon.</p>}
        {value === 2 && <p className="text-sm text-slate-500">Reviews coming soon.</p>}
      </div>
    </div>
  );
}