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
    <div className="venue-form-page">
      <div className="venue-form-card">
        <h1>Create Venue</h1>
        {error && <p className="venue-form-error">{error}</p>}

        <form className="venue-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Venue Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label>Sports</label>
          <div className="venue-form-checkbox-group">
            {['football', 'padel', 'basketball', 'tennis', 'swimming'].map((sport) => (
              <label key={sport}>
                <input
                  type="checkbox"
                  value={sport}
                  checked={formData.sportType.includes(sport)}
                  onChange={handleSportChange}
                />
                {sport.charAt(0).toUpperCase() + sport.slice(1)}
              </label>
            ))}
          </div>

          <label htmlFor="pricePerHour">Price Per Hour</label>
          <input
            id="pricePerHour"
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            min="10"
            max="30"
            required
          />

          <label htmlFor="images">Images from your computer</label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {selectedImages.length > 0 && (
            <p className="venue-form-help">
              Selected: {selectedImages.map((file) => file.name).join(", ")}
            </p>
          )}

          <label htmlFor="facilities">Facilities</label>
          <input
            id="facilities"
            type="text"
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
            placeholder="Parking, Changing Room"
          />

          <div className="venue-form-actions">
            <button type="button" className="venue-form-secondary" onClick={() => navigate('/admin')}>
              Cancel
            </button>
            <button type="submit" className="venue-form-primary">
              Create Venue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateVenuePage;
