import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Table } from 'flowbite-react';

import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';

import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons

export default function ManagerDiscountDetails() {
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/auth/discounts`);
      if (!response.ok) {
        throw new Error('Failed to fetch details');
      }
      const data = await response.json();
      setOrders(data);

      // Fetch images from Firebase for each order
     
    } catch (error) {
      console.error('Error fetching orders:', error);
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
              <Table.HeadCell>Discount ID</Table.HeadCell>
              <Table.HeadCell>Item Category</Table.HeadCell>
              <Table.HeadCell>Discount percentage</Table.HeadCell>
              <Table.HeadCell>Promo Code</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body id="discount-details-table-body">
              {orders.map((discount) => (
                <Table.Row key={discount._id}>
                  {/* Table Cells */}
                  <Table.Cell>{discount.discountId}</Table.Cell>
                  <Table.Cell>{discount.itemCategory}</Table.Cell>
                  <Table.Cell>{discount.discount}</Table.Cell>
                  <Table.Cell>{discount.promoCode}</Table.Cell>

                  <Table.Cell>
                      <Button id="al-details-delete-btn" onClick={() => {
                        setShowModal(true);
                        setOrderIdToDelete(discount._id);
                      }}>
                        <FaTrashAlt />
                      </Button>

                      <Link to={`/updatediscount/${discount._id}`}>
                    <Button id='edit-btn' className="text-green-500"> <FaEdit /></Button>
                  </Link>
                    </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p>You have no discounts added yet!</p>
        )}

        {/* <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
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
        </Modal> */}
      </div>
    </div>
  );
}