import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import './css/addpet.css';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      setError('Something went wrong!');
    }
  };


  return (
    <div className="add-pet-container">
      <h1>Add Item</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Product Name' onChange={(e) => setFormData({ ...formData, productName: e.target.value })} />
        <input type="text" placeholder='Category' onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
        <input type="text" placeholder='Unit price' onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })} />
        <input type="text" placeholder='Quantity' onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />

        <input type='file' ref={fileRef1} id='itemPicture' hidden accept='image/*' onChange={(e) => setImage1(e.target.files[0])} />
        <input type='file' ref={fileRef2} id='alternateItemPicture' hidden accept='image/*' onChange={(e) => setImage2(e.target.files[0])} />

        <div>
          <button className="upload-button" type="button" onClick={handleImage1Click}>
            Upload Item Image 1
          </button>
          <button className="upload-button" type="button" onClick={handleImage2Click}>
          Upload Item Image 2
          </button>
        </div>

        <div>
          <img src={formData.itemPicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='} alt='Profile' onClick={handleImage1Click} />
          <img src={formData.alternateItemPicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='} alt='Alternate Profile' onClick={handleImage2Click} />
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

      {error && <p>{error}</p>}
    </div>
  );
}
