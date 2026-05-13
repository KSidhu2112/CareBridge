import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../../../../carebridge/src/assets/assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({url}) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("image", image);

    try {
      const res = await axios.post(
        `${url}/api/donation/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
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
      toast.error("⚠️ Something went wrong while uploading");
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
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
