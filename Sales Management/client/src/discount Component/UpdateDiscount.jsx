import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { app } from '../firebase';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';

function UpdateDiscountDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [updatediscount, setupdatediscount] = useState({
    discountId: "",
    itemCategory: "",
    discount: "",
    promoCode: "", 
  });

 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/getdiscount/${id}`);
        const data = await response.json();
        console.log(data);

        if (data.success) {
          setupdatediscount(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    setupdatediscount({
      ...updatediscount,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/user/updatediscount`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updatediscount._id,
          ...updatediscount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Discount details updated successfully');
        alert("Updated successfully");
        navigate('/allDiscount')
        
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div className='service-update'>
      <label>Discount ID:</label>
      <input type="text" id="discountId" name="discountId" onChange={handleInputChange} value={updatediscount?.discountId} /><br />
      <label>Item Category:</label>
      <input type="text" id="itemCategory" name="itemCategory" onChange={handleInputChange} value={updatediscount?.itemCategory} /><br />
      <label>Discount percentage:</label>
      <input type="text" id="discount" name="discount" onChange={handleInputChange} value={updatediscount?.discount} /><br />
      <label>Promo Code:</label>
      <input type="text" id="promoCode" name="promoCode" onChange={handleInputChange} value={updatediscount?.promoCode} /><br />
     

      <button className='update-btn' onClick={handleUpdate}>Update Discount Details</button><br /><br />
    </div>
  );
}

export default UpdateDiscountDetails;
