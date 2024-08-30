import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';


export default function AddDiscount() {


  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser._id,
    discountId: "",
    itemCategory: "",
    discount: "",
    promoCode: "",
  });

 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/discountadd', {
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
      <h1>Add discount</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='discount Id' onChange={(e) => setFormData({ ...formData, discountId: e.target.value })} />
        <input type="text" placeholder='item Category' onChange={(e) => setFormData({ ...formData, itemCategory: e.target.value })} />
        <input type="text" placeholder='discount' onChange={(e) => setFormData({ ...formData, discount: e.target.value })} />
        <input type="text" placeholder='promo Code' onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })} />

       
       


        <button id='submit-button' type="submit">Add Discount</button><br></br><br></br>
        
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}
