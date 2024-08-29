import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';
import logo from './css/delete-icon.png';
import './css/allDetails.css'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons


export default function ManagerAllDetails() {
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/auth/managers/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);

      // Fetch images from Firebase for each order
      data.forEach(order => {
        if (order.itemPicture) {
          fetchFirebaseImage(order.itemPicture, 'profilePicture', order._id);
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
      {/* <div id="admin-page-names" className="flex justify-between mb-4">
        <Link id="add-task-page-btn" to="/AdminAllTask">
          All Task
        </Link>
        <Link id="all-task-page-btn" to="/AddTask">
          Add Task
        </Link>
      </div> */}

      <div className="overflow-x-auto">
        <h2 className="my-8 text-center font-bold text-4xl text-gray-800">Available Items</h2>

        {orders.length > 0 ? (
          <Table hoverable id="all-details-table">
            <Table.Head id="all-details-table-head">
              {/* Table Headings */}
              <Table.HeadCell>Product Name</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
              <Table.HeadCell>Unit price</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>Photos</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body id="all-details-table-body">
              {orders.map((order) => (
                <Table.Row key={order._id}>
                  {/* Table Cells */}
                  <Table.Cell>{order.productName}</Table.Cell>
                  <Table.Cell>{order.category}</Table.Cell>
                  <Table.Cell>{order.unitPrice}</Table.Cell>
                  <Table.Cell>{order.quantity}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      {order.itemPicture && (
                        <img src={order.itemPicture} alt="Profile" className="h-12 w-12 object-cover rounded" />
                      )}
                    </div>
                  
                    <div className="flex gap-2">
                      {order.alternateItemPicture && (
                        <img src={order.alternateItemPicture} alt="Profile" className="h-12 w-12 object-cover rounded" />
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
  <Button id="al-details-delete-btn" onClick={() => {
    setShowModal(true);
    setOrderIdToDelete(order._id);
  }}>
    <FaTrashAlt />
  </Button>
  <Button>
    <FaEdit />
  </Button>
</Table.Cell>

                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p>You have no orders yet!</p>
        )}

        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center-alert">
              <HiOutlineExclamationCircle className="mx-auto mb-2 text-4xl text-red-600" />
              <h3>Are you sure you want to delete this Staff Member?</h3>
            </div>
            <div className="modal-button-group flex justify-center gap-4 mt-4">
              <Button color="failure" onClick={handleDeleteOrder}>
                Yes, I am sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}