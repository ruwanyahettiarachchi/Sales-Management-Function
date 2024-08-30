import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './css/updateitem.css';
import { app } from '../firebase';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';

function UpdateItemDetails() {
  const [imagePercent, setImagePercent] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef1 = useRef(null);
  const fileRef2 = useRef(null);
  const [image1, setImage1] = useState(undefined);
  const [image2, setImage2] = useState(undefined);
  const [updateitem, setupdateitem] = useState({
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
        console.error('Image upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setupdateitem((prev) => ({
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/getitem/${id}`);
        const data = await response.json();
        console.log(data);

        if (data.success) {
          setupdateitem(data.data);
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
    setupdateitem({
      ...updateitem,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/user/updateitem`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updateitem._id,
          ...updateitem,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Item updated successfully');
        alert("Updated successfully");
        navigate('/');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div className='service-update'>
      <label>Item Name:</label>
      <input type="text" id="productName" name="productName" onChange={handleInputChange} value={updateitem?.productName} /><br />
      <label>Category:</label>
      <input type="text" id="category" name="category" onChange={handleInputChange} value={updateitem?.category} /><br />
      <label>Unit Price:</label>
      <input type="text" id="unitPrice" name="unitPrice" onChange={handleInputChange} value={updateitem?.unitPrice} /><br />
      <label>Quantity:</label>
      <input type="text" id="quantity" name="quantity" onChange={handleInputChange} value={updateitem?.quantity} /><br />
      <input type='file' ref={fileRef1} id='itemPicture' hidden accept='image/*' onChange={(e) => setImage1(e.target.files[0])} />
      <input type='file' ref={fileRef2} id='alternateItemPicture' hidden accept='image/*' onChange={(e) => setImage2(e.target.files[0])} />

      <div className='flex justify-center items-center gap-4'>
        <button type="button" onClick={handleImage1Click} className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload Item Picture 1
        </button>
        <button type="button" onClick={handleImage2Click} className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload Item Picture 2
        </button>
      </div>

      <div className='flex justify-center items-center gap-4'>
        <img src={updateitem.itemPicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='} alt='Profile' className='h-20 w-20 self-center cursor-pointer object-cover border border-gray-300' onClick={handleImage1Click} />
        <img src={updateitem.alternateItemPicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='} alt='Alternate Profile' className='h-20 w-20 self-center cursor-pointer object-cover border border-gray-300' onClick={handleImage2Click} />
      </div>

      <button className='update-btn' onClick={handleUpdate}>Update Item Details</button><br /><br />
    </div>
  );
}

export default UpdateItemDetails;
