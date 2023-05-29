import React from 'react'
import { Tabs } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { Divider, Space, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function Requestscreen() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!user || !user.isAdmin) {
            window.location.href = '/login';
        }
    }, []);

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        async function fetchRequests() {
            const response = await axios.get('/api/events/getEvents');
            setRequests(response.data);
            console.log(response.data);
        }
        fetchRequests();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-6 ml-5'>
                {requests.map(request => {
                    return (
                        <div className='flex-container bs'>
                            <div className='text-left w-100 m-1'>
                                <h1>Request Details</h1>
                                <Divider />
                                <p><b>Request ID:</b> {request._id}</p>
                                <p><b>Company Name:</b> {request.companyName}</p>
                                <p><b>Company Phone Number:</b> {request.companyPhone}</p>
                                <p><b>Company Email:</b> {request.companyEmail}</p>
                                <p><b>Company Address:</b> {request.companyAddress}</p>
                                <p><b>Event Type:</b> {request.eventType}</p>
                                <p><b>From Date:</b> {request.fromDate}</p>
                                <p><b>To Date:</b> {request.toDate}</p>
                                <p><b>Event Details:</b> {request.eventDetails}</p>
                                <p><b>Event Requirements:</b> {request.eventRequirements.map((item) => (
                                    <ul>
                                        <li>{item}</li>
                                    </ul>
                                ))}</p>
                                <p><b>Event Status:</b> {request.status === 'waiting' ? <Tag color="orange">Waiting</Tag> : request.status === 'approved' ? <Tag color="green">Approved</Tag> : <Tag color="red">Cancelled</Tag>}</p>
                            </div>
                            {/* //Cancel, Approve and Delete buttons using Swal */}
                            {request.status !== 'cancelled' && (<button className='btn btn-danger m-3' onClick={() => {
                                Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You won't be able to revert this!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Yes, cancel it!'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        axios.put('/api/events/cancelEvent', { eventid: request._id }).then((response) => {
                                            Swal.fire(
                                                'Cancelled!',
                                                'Your request has been cancelled.',
                                                'success'
                                            ).then((result) => {
                                                window.location.href = '/admin/5';
                                            })
                                        })
                                    }
                                })}}>Cancel</button>)}
                            {request.status === 'waiting' && (<button className='btn btn-success m-3' onClick={() => {
                                Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You won't be able to revert this!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Yes, approve it!'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        axios.put('/api/events/approveEvent', { eventid: request._id }).then((response) => {
                                            Swal.fire(
                                                'Approved!',
                                                'Your request has been approved.',
                                                'success'
                                            ).then((result) => {
                                                window.location.href = '/admin/5';
                                            })
                                        })
                                    }
                                }
                                )}}>Approve</button>)}
                            <button className='btn btn-danger m-3' onClick={() => {
                                Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You won't be able to revert this!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Yes, delete it!'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        axios.delete(`/api/events/deleteEvent/${request._id}`).then((response) => {
                                            Swal.fire(
                                                'Deleted!',
                                                'Your request has been deleted.',
                                                'success'
                                            ).then((result) => {
                                                window.location.href = '/admin/5';
                                            })
                                        })
                                    }
                                }
                                )}}>Delete</button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Requestscreen