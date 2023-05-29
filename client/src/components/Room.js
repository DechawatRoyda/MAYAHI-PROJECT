import React from 'react'
import { Modal, Button, Carousel } from 'react-bootstrap'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Room({ room, fromDate, toDate }) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function isDateAndUserNull() {
        if (JSON.parse(localStorage.getItem('currentUser')) === null) {
            alert('Please login to book room');
            window.location.href = '/login';
        }
        else {
            if (fromDate === null || toDate === null) {
                alert('Please select dates')
            } else {
                if (fromDate === toDate)
                    alert('Please select different dates')
                else
                    window.location.href = `/booking/${room._id}/${fromDate}/${toDate}`;
            }
        }
    }

    return (
        <div className='row bs RoomBGC'>
            <div className='col-md-4'>
                <img src={room.imageurls[0]} alt={room.name} className='smallimg zoom' />
            </div>
            <div className='col-md-7'>
                <h1>{room.name}</h1>
                <b>
                    <p>Max Count: {room.maxcount}</p>
                    <p>Phone Number: {room.phonenumber}</p>
                    <p>Type: {room.type}</p>
                </b>
               
                <div style={{ float: 'right' }}>
                <button className='btn btn-primary m-2' onClick={isDateAndUserNull}>Book Now</button>
                    <button className='btn btn-primary' onClick={handleShow}>View Details</button>
                </div>

                <Modal show={show} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{room.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Carousel>
                            {room.imageurls.map((imageurl) => (
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100 bigimg"
                                        src={imageurl}
                                        alt="First slide"
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        {room.description}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </div>
    )
}

export default Room