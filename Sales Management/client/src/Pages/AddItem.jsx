import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import './css/additem.css';

export default function AddItem() {
  const [imagePercent, setImagePercent] = useState(0);
  const fileRef1 = useRef(null);
  const fileRef2 = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [image1, setImage1] = useState(undefined);
  const [image2, setImage2] = useState(undefined);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser._id,
    productName: "",
    category: "",
    unitPrice: "",
    quantity: "",
    itemPicture: "",
    alternateItemPicture: ""
  });

  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'itemPicture');
    }
  }, [image1]);

  useEffect(() => {
    if (image2) {
      handleFileUpload(image2, 'alternateItemPicture');
    }
  }, [image2]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        setError('Image upload failed');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({
            ...prev,
            [field]: downloadURL
          }));
        });
      }
    );
  };

  const handleImage1Click = () => {
    fileRef1.current.click();
  };

  const handleImage2Click = () => {
    fileRef2.current.click();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { productName, category, unitPrice, quantity, itemPicture } = formData;
    if (!productName.trim()) {
      setError('Product Name is required');
      return false;
    }
    if (!category) {
      setError('Category is required');
      return false;
    }
    if (!unitPrice || isNaN(unitPrice) || parseFloat(unitPrice) <= 0) {
      setError('Unit Price must be a positive number');
      return false;
    }
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      setError('Quantity must be a positive integer');
      return false;
    }
    if (!itemPicture) {
      setError('Item Picture is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    try {
      const res = await fetch('/api/auth/itemadd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create item');
      }

      alert('Item added successfully');
      navigate('/');
    } catch (error) {
      setError('Something went wrong!');
    }
  };

  return (
    <div className="add-pet-container">
      <h1>Add Item</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='Product Name'
          name="productName"
          onChange={handleChange}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="category-dropdown"
        >
          <option value="">Select Category</option>
          <option value="trousers">Trousers</option>
          <option value="jeans">Jeans</option>
          <option value="frocks">Frocks</option>
          <option value="tops">Tops</option>
          <option value="tshirts">T-Shirts</option>
        </select>

        <input
          type="text"
          placeholder='Unit price'
          name="unitPrice"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder='Quantity'
          name="quantity"
          onChange={handleChange}
        />

        <input type='file' ref={fileRef1} id='itemPicture' hidden accept='image/*' onChange={(e) => setImage1(e.target.files[0])} />
        <input type='file' ref={fileRef2} id='alternateItemPicture' hidden accept='image/*' onChange={(e) => setImage2(e.target.files[0])} />

        <div>
          <img src={formData.itemPicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='} alt='Profile' onClick={handleImage1Click} />
          <img src={formData.alternateItemPicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='} alt='Alternate Profile' onClick={handleImage2Click} />
        </div>

        <div>
          <button className="upload-button" type="button" onClick={handleImage1Click}>
            Upload Item Image 1
          </button>
          <button className="upload-button" type="button" onClick={handleImage2Click}>
            Upload Item Image 2
          </button>
        </div>

        <p className="upload-progress-errors">
          {imageError ? (
            <span>Error uploading image (file size must be less than 2 MB)</span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span>{`Uploading: ${imagePercent}%`}</span>
          ) : imagePercent === 100 ? (
            <span>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>

        <button id='submit-button' type="submit">Add Item</button><br></br><br></br>
        
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
