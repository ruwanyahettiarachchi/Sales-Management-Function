import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Table } from 'flowbite-react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';
import './css/allDetails.css';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa'; // Importing icons

export default function ManagerAllDetails() {
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/auth/allitems`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);

      // Fetch images from Firebase for each order
      data.forEach(order => {
        if (order.itemPicture) {
          fetchFirebaseImage(order.itemPicture, 'itemPicture', order._id);
        }
        if (order.alternateItemPicture) {
          fetchFirebaseImage(order.alternateItemPicture, 'alternateItemPicture', order._id);
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchFirebaseImage = async (imageUrl, field, orderId) => {
    const storageRef = ref(storage, imageUrl);
    try {
      const downloadUrl = await getDownloadURL(storageRef);
      setOrders(prevOrders => prevOrders.map(order => {
        if (order._id === orderId) {
          return {
            ...order,
            [field]: downloadUrl
          };
        }
        return order;
      }));
    } catch (error) {
      console.error(`Error fetching image from Firebase for ${field}:`, error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const res = await fetch(`/api/user/deleteitem/${orderIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log('Delete failed:', data.message);
      } else {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderIdToDelete)
        );
        setOrderIdToDelete('');  // Reset orderIdToDelete after deletion
        console.log('Order deleted successfully');
      }
      setShowModal(false);
    } catch (error) {
      console.log('Error deleting order:', error.message);
    }
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <h2 className="my-8 text-center font-bold text-4xl text-gray-800">Available Items</h2>

        {orders.length > 0 ? (
          <Table hoverable id="all-details-table">
            <Table.Head id="all-details-table-head">
              <Table.HeadCell>Product Name</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Unit Price</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>Photos</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body id="all-details-table-body">
              {orders.map((order) => (
                <Table.Row key={order._id}>
                  <Table.Cell>{order.productName}</Table.Cell>
                  <Table.Cell>{order.category}</Table.Cell>
                  <Table.Cell>{order.unitPrice}</Table.Cell>
                  <Table.Cell>{order.quantity}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      {order.itemPicture && (
                        <img src={order.itemPicture} alt="Product" className="h-12 w-12 object-cover rounded" />
                      )}
                      {order.alternateItemPicture && (
                        <img src={order.alternateItemPicture} alt="Product" className="h-12 w-12 object-cover rounded" />
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="flex gap-2">
                    <Link to={`/singleitemview/${order._id}`}>
                      <FaEye className="text-blue-600 hover:text-blue-800 cursor-pointer" />
                    </Link>
                    <Link to={`/update-items/${order._id}`}>
                      <FaEdit className="text-yellow-600 hover:text-yellow-800 cursor-pointer" />
                    </Link>
                    <FaTrashAlt
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setOrderIdToDelete(order._id);
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p>You have no orders yet!</p>
        )}

        {/* Modal Code Here */}
      </div>
    </div>
  );
}
