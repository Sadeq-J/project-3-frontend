import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function CreateVenuePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    sportType: [],
    pricePerHour: "",
    images: "",
    facilities: "",
  });
  function handleChange(event) {
    setFormData({ ...FormData, [event.target.name]: event.target.value });
  }
  return (
    <div>
      <h1>Create Venue</h1>
      <form>
        <div>
          <label htmlFor="name">Venue Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
      </form>
    </div>
  );
}

export default CreateVenuePage;
