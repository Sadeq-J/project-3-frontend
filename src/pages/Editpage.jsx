import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVenueById, updateVenueById } from "../services/venueService";

function EditVenuePage() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState({
    name: "",
    description: "",
    location: "",
    sportType: [],
    pricePerHour: "",
    facilities: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      try {
        const data = await getVenueById(venueId);
        setVenue({
          name: data.name || "",
          description: data.description || "",
          location: data.location || "",
          sportType: data.sportType || [],
          pricePerHour: data.pricePerHour || "",
          facilities: data.facilities ? data.facilities.join(", ") : "",
        });
      } catch (error) {
        setError(error.response?.data?.error || "Failed to load venue");
      }
    }
    fetchVenue();
  }, [venueId]);

  function handleChange(event) {
    setVenue({
      ...venue,
      [event.target.name]: event.target.value,
    });
  }

  function handleSportChange(event) {
    const sport = event.target.value;
    if (event.target.checked) {
      setVenue({
        ...venue,
        sportType: [...venue.sportType, sport],
      });
    } else {
      setVenue({
        ...venue,
        sportType: venue.sportType.filter((item) => item !== sport),
      });
    }
  }

  function handleImageChange(event) {
    setSelectedImages(Array.from(event.target.files || []));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!venue.sportType.length) {
      setError("Please select at least one sport type.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", venue.name);
      payload.append("description", venue.description);
      payload.append("location", venue.location);
      payload.append("pricePerHour", String(Number(venue.pricePerHour)));

      venue.sportType.forEach((sport) => payload.append("sportType", sport));

      venue.facilities
        .split(",")
        .map((facility) => facility.trim())
        .filter(Boolean)
        .forEach((facility) => payload.append("facilities", facility));

      selectedImages.forEach((file) => payload.append("images", file));

      await updateVenueById(venueId, payload);
      navigate(`/venues/${venueId}`);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update venue");
    }
  }

  return (
    <div className="venue-form-page">
      <div className="venue-form-card">
        <h1>Edit Venue</h1>
        {error && <p className="venue-form-error">{error}</p>}

        <form className="venue-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={venue.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={venue.description}
            onChange={handleChange}
          />

          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={venue.location}
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
                  checked={venue.sportType.includes(sport)}
                  onChange={handleSportChange}
                />
                {sport.charAt(0).toUpperCase() + sport.slice(1)}
              </label>
            ))}
          </div>

          <label htmlFor="pricePerHour">Price Per Hour</label>
          <input
            type="number"
            id="pricePerHour"
            name="pricePerHour"
            value={venue.pricePerHour}
            onChange={handleChange}
            min="10"
            max="30"
            required
          />

          <label htmlFor="images">Images from your computer</label>
          <input
            type="file"
            id="images"
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
            type="text"
            id="facilities"
            name="facilities"
            value={venue.facilities}
            onChange={handleChange}
            placeholder="Parking, Changing Room"
          />

          <div className="venue-form-actions">
            <button type="button" className="venue-form-secondary" onClick={() => navigate('/admin')}>
              Cancel
            </button>
            <button type="submit" className="venue-form-primary">
              Update Venue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVenuePage;
