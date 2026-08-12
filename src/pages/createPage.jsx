import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVenue } from "../services/venueService";

function CreateVenuePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    sportType: [],
    pricePerHour: "",
    facilities: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState("");

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSportChange(event) {
    const sport = event.target.value;
    if (event.target.checked) {
      setFormData({ ...formData, sportType: [...formData.sportType, sport] });
    } else {
      setFormData({
        ...formData,
        sportType: formData.sportType.filter((item) => item !== sport),
      });
    }
  }

  function handleImageChange(event) {
    setSelectedImages(Array.from(event.target.files || []));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.sportType.length) {
      setError("Please select at least one sport type.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("description", formData.description.trim());
      payload.append("location", formData.location.trim());
      payload.append("pricePerHour", String(Number(formData.pricePerHour)));

      formData.sportType.forEach((sport) => payload.append("sportType", sport));

      formData.facilities
        .split(",")
        .map((facility) => facility.trim())
        .filter(Boolean)
        .forEach((facility) => payload.append("facilities", facility));

      selectedImages.forEach((file) => payload.append("images", file));

      const createdVenue = await createVenue(payload);
      navigate(`/admin/venues/${createdVenue._id || createdVenue.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create venue");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Management</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-slate-900">Create a venue</h1>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Venue name</label>
                <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className="field-input" required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="field-input" />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Location</label>
                <input id="location" type="text" name="location" value={formData.location} onChange={handleChange} className="field-input" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="pricePerHour" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Price per hour</label>
                <input id="pricePerHour" type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} className="field-input" required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Sports</label>
                <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  {['football', 'padel', 'basketball', 'tennis', 'swimming'].map((sport) => (
                    <label key={sport} className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                      <input type="checkbox" value={sport} checked={formData.sportType.includes(sport)} onChange={handleSportChange} className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                      {sport.charAt(0).toUpperCase() + sport.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="facilities" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Facilities</label>
                <input id="facilities" type="text" name="facilities" value={formData.facilities} onChange={handleChange} className="field-input" placeholder="Parking, changing room, lounge" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="images" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Venue images</label>
                <input id="images" type="file" accept="image/*" multiple onChange={handleImageChange} />
                {selectedImages.length > 0 && (
                  <p className="text-sm text-slate-500">Selected: {selectedImages.map((file) => file.name).join(", ")}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button type="button" className="secondary-button" onClick={() => navigate("/admin")}>Cancel</button>
              <button type="submit" className="primary-button">Create venue</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateVenuePage;
