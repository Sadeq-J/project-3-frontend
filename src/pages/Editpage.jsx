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
    images: "",
    facilities: "",
  });
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
          images: data.images ? data.images.join(", ") : "",
          facilities: data.facilities ? data.facilities.join(", ") : "",
        });
      } catch (error) {
        console.error(error);
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
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await updateVenueById(venueId, {
        name: venue.name,
        description: venue.description,
        location: venue.location,
        sportType: venue.sportType,
        pricePerHour: Number(venue.pricePerHour),
        images: venue.images
          ? venue.images.split(",").map((image) => image.trim())
          : [],
        facilities: venue.facilities
          ? venue.facilities.split(",").map((facility) => facility.trim())
          : [],
      });
      navigate(`/venues/${venueId}`);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <h1>Edit Venue</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={venue.name}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={venue.description}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={venue.location}
          onChange={handleChange}
          required
        />
        <br />
        <label>Sports</label>
        <div>
          <label>
            <input
              type="checkbox"
              value="football"
              checked={venue.sportType.includes("football")}
              onChange={handleSportChange}
            />
            Football
          </label>
          <label>
            <input
              type="checkbox"
              value="padel"
              checked={venue.sportType.includes("padel")}
              onChange={handleSportChange}
            />
            Padel
          </label>
          <label>
            <input
              type="checkbox"
              value="basketball"
              checked={venue.sportType.includes("basketball")}
              onChange={handleSportChange}
            />
            Basketball
          </label>
          <label>
            <input
              type="checkbox"
              value="tennis"
              checked={venue.sportType.includes("tennis")}
              onChange={handleSportChange}
            />
            Tennis
          </label>
          <label>
            <input
              type="checkbox"
              value="swimming"
              checked={venue.sportType.includes("swimming")}
              onChange={handleSportChange}
            />
            Swimming
          </label>
        </div>
        <br />
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
        <br />
        <label htmlFor="images">Images</label>
        <input
          type="text"
          id="images"
          name="images"
          value={venue.images}
          onChange={handleChange}
          placeholder="Image URLs separated by commas"
        />
        <br />
        <label htmlFor="facilities">Facilities</label>
        <input
          type="text"
          id="facilities"
          name="facilities"
          value={venue.facilities}
          onChange={handleChange}
          placeholder="Parking, Changing Room"
        />
        <br />
        <button type="submit">Update Venue</button>
      </form>
    </div>
  );
}
export default EditVenuePage;
