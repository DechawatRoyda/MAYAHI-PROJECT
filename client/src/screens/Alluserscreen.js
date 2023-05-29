import React from 'react'
import { Tabs } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { Divider, Space, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const { TabPane } = Tabs;

function Alluserscreen() {
    const [allusers, setAllusers] = useState([])
    const [show, setShow] = useState(false)
    const [userBookings, setUserBookings] = useState([])
    const [userOrders, setUserOrders] = useState([])
    const [userBorrowings, setUserBorrowings] = useState([])
    const [userEvents, setUserEvents] = useState([])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!user||!user.isAdmin) {
            window.location.href = '/login';
        }
    }, []);
    
    useEffect(() => {
        async function fetchAllusers() {
            const { data } = await axios.get('/api/users/getUsers')
            setAllusers(data)
            console.log(data)
        }
        fetchAllusers()
    }, [])

    async function fetchUserData(userid) {
        handleShow()
        const { data } = await axios.get(`/api/bookings/getBookingsByUserId/${userid}`)
        setUserBookings(data)
        const { data: data2 } = await axios.get(`/api/orders/getOrdersByUserId/${userid}`)
        setUserOrders(data2)
        const { data: data3 } = await axios.get(`/api/borrowboardgames/getBorrowsByUserId/${userid}`)
        setUserBorrowings(data3)
        const { data: data4 } = await axios.get(`/api/events/getEventById/${userid}`)
        setUserEvents(data4)
    }

    return (
        <div className='m-5'>
            <h2>All Users</h2>
            <Divider />
            <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>isAdmin</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {allusers.map(user => {
                        return <tr>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? <Tag color="green">Yes</Tag> : <Tag color="volcano">No</Tag>}</td>
                            <td className='text-center'><button className='btn btn-success' onClick={() => fetchUserData(user._id)}>View Details</button></td>
                        </tr>
                    }
                    )}
                </tbody>
            </table>
            <Modal show={show} onHide={handleClose} >
                <div class="modal-content modal-container" style={{  width:"max-content",height: "max-content" }}>
                <Modal.Header closeButton >
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'  }}>
                    <Tabs defaultActiveKey='1' centered>
                        <TabPane tab="User Bookings" key="1">
                            <div>
                                <table className='table table-striped table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Booking ID</th>
                                            <th>Room ID</th>
                                            <th>From Date</th>
                                            <th>To Date</th>
                                            <th>Total Price</th>
                                            <th>Booking Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userBookings.map(booking => {
                                            return <tr>
                                                <td>{booking._id}</td>
                                                <td>{booking.room}</td>
                                                <td>{booking.fromdate}</td>
                                                <td>{booking.todate}</td>
                                                <td>{booking.totalprice}</td>
                                                <td>{booking.status === 'booked' ? <Tag color="green">Booked</Tag> : booking.status === 'cancelled' ? <Tag color="volcano">Cancelled</Tag> : <Tag color="orange">Waiting</Tag>}</td>
                                            </tr>
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </TabPane>
                        <TabPane tab="User Orders" key="2">
                            <div>
                                <table className='table table-striped table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Order Date</th>
                                            <th>Order Items</th>
                                            <th>Total Price</th>
                                            <th>Order Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userOrders.map(order => {
                                            return <tr>
                                                <td>{order._id}</td>
                                                <td>{order.createdAt.substring(0, 10)}</td>
                                                <td>{order.orderitems.map(item => {
                                                    return <div>
                                                        <ul>
                                                            <li>{item.name} ({item.option}) - {item.count} x {item.foodprice} = {item.totalprice}</li>
                                                        </ul>
                                                    </div>
                                                })}</td>
                                                <td>{order.totalprice}</td>
                                                <td>{order.orderstatus === 'done' ? <Tag color="green">Done</Tag> : order.orderstatus === 'cancelled' ? <Tag color="volcano">Cancelled</Tag> : <Tag color="orange">Cooking</Tag>}</td>
                                            </tr>
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </TabPane>
                        <TabPane tab="User Borrowings" key="3">
                            <div>
                                <table className='table table-striped table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Borrow ID</th>
                                            <th>Borrow Date</th>
                                            <th>Borrow Items</th>
                                            <th>Total Price</th>
                                            <th>Borrow Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userBorrowings.map(borrow => {
                                            return <tr>
                                                <td>{borrow._id}</td>
                                                <td>{borrow.createdAt.substring(0, 10)}</td>
                                                <td>{borrow.boardgames.map(item => {
                                                    return <div>
                                                        <ul>
                                                            <li>{item.name} - {item.count} x {item.lendingPrice} = {item.totalprice}</li>
                                                        </ul>
                                                    </div>
                                                })}</td>
                                                <td>{borrow.totalprice}</td>
                                                <td>{borrow.borrowstatus === 'Returned' ? <Tag color="green">Returned</Tag> : <Tag color="orange">Borrowing</Tag>}</td>
                                            </tr>
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </TabPane>
                        <TabPane tab="User Events" key="4">
                            <div>
                                <table className='table table-striped table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Company Name</th>
                                            <th>Company Email</th>
                                            <th>Company Phone Number</th>
                                            <th>From Date</th>
                                            <th>To Date</th>
                                            <th>Event Details</th>
                                            <th>Event Requirements</th>
                                            <th>Request Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userEvents.map(event => {
                                            return <tr>
                                                <td>{event.companyName}</td>
                                                <td>{event.companyEmail}</td>
                                                <td>{event.companyPhone}</td>
                                                <td>{event.fromDate}</td>
                                                <td>{event.toDate}</td>
                                                <td>{event.eventDetails}</td>
                                                <td>{event.eventRequirements.map(item => {
                                                    return <div>
                                                        <ul>
                                                            <li>{item}</li>
                                                        </ul>
                                                    </div>
                                                })}</td>
                                                <td>{event.requestStatus === 'approved' ? <Tag color="green">Approved</Tag> : event.requestStatus === 'rejected' ? <Tag color="volcano">Rejected</Tag> : <Tag color="orange">Waiting</Tag>}</td>
                                            </tr>
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </TabPane>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
                </div>
            </Modal>
 
        </div>
    )
}

export default Alluserscreen