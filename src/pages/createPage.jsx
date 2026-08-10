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

  return (
    <div>
      <h1> CREATE VENUE</h1>
    </div>
  );
}

export default CreateVenuePage;
