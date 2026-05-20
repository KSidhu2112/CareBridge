import React, { useState } from 'react';
import './Donation.css';
import { assets } from '../../assets/assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

const Donation = () => {
    const {url, token} = useContext(StoreContext)
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "veg",
    price: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Decode userId from JWT token
  const getUserIdFromToken = () => {
    try {
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("image", image);

    // Include the donor's userId if logged in
    const userId = getUserIdFromToken();
    if (userId) {
      formData.append("donorId", userId);
    }

    try {
      const res = await axios.post(
        `${url}/api/donation/create`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            token: token
          },
        }
      );

      if (res.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "veg",
        });
        setImage(null);
        toast.success(res.data.message);
       
      } else {
       toast.success(res.data.message);

      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("⚠️ Something went wrong while uploading");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={handleSubmit}>
        <p>Upload Image</p>
        <div className="upload-image">
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <br />

        <div className="item-name flex-col">
          <p>Product Name</p>
          <input
            onChange={handleChange}
            value={data.name}
            type="text"
            name="name"
            placeholder="Product Name"
            required
          />
        </div>

        <br />

        <div className="item-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={handleChange}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Enter Product Description"
            required
          ></textarea>
        </div>

        <br />

        <div className="item-category flex-col">
          <p>Product Category</p>
          <select
            onChange={handleChange}
            value={data.category}
            name="category"
            required
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="education">Education</option>
          </select>
        </div>

        <br />

        <div className="item-price flex-col">
          <p>Product Price</p>
          <input
            onChange={handleChange}
            value={data.price}
            type="number"
            name="price"
            placeholder="Product Price"
            required
          />
        </div>

        <br />

        <button type="submit" className="item-btn">
          Donation Product
        </button>
      </form>
    </div>
  );
};

export default Donation;
