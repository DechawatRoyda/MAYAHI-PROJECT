import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Modal, Button, Carousel } from 'react-bootstrap'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import Navbar from '../components/Navbar'

const Bookingscreen = ({ match }) => {

    const [data, setData] = useState([{ imageurls: [] }])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const { roomid, fromdate, todate } = useParams(match);
    const [paymentMethod, setPaymentMethod] = useState('PromptPay');
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpireDate, setCardExpireDate] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const totalDays = moment(todate, 'DD-MM-YYYY').diff(moment(fromdate, 'DD-MM-YYYY'), 'days');
    const totalPrice = totalDays * data.rentperday;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [files, setFiles] = useState([]);
    const [fileURLs, setFileURLs] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        const fileURLsArray = Array.from(selectedFiles).map((file) => URL.createObjectURL(file));
        setFileURLs(fileURLsArray);
        setFiles(selectedFiles);
        console.log(selectedFiles, fileURLsArray);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: response } = await axios.get(`/api/rooms/getRoomByID/${roomid}`);
                console.log(response);
                setData(response);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
                console.error(error.message);
            }
        }
        fetchData();
    }, []);

    async function bookingRoom() {
        let paymentObject = {};
        const img = new FormData();
        img.append("file", files[0]);
        img.append("upload_preset", "mayahi");

        try {
            if (paymentMethod === 'PromptPay') {
                if (files.length === 0) {
                    Swal.fire('Oops...', 'Please upload your payment slip!', 'error');
                    return;
                }
                else {
                    const uploadRes = await axios.post(
                        "https://api.cloudinary.com/v1_1/dhphmf8vg/image/upload",
                        img
                    );

                    const realUrl = uploadRes.data.secure_url;

                    console.log(realUrl);
                    paymentObject = {
                        paymentMethod,
                        img: realUrl
                    }
                }
            }
            if (paymentMethod === 'Credit-Card') {
                if (cardHolderName === '' || cardNumber === '' || cardExpireDate === '' || cardCVV === '') {
                    Swal.fire('Oops...', 'Please fill in all fields!', 'error');
                    return;
                } else {
                    paymentObject = {
                        paymentMethod,
                        cardHolderName,
                        cardNumber,
                        cardExpireDate,
                        cardCVV
                    }
                }
            }
            if (paymentMethod === 'Cash') {
                if (customerName === '' || customerPhone === '') {
                    Swal.fire('Oops...', 'Please fill in all fields!', 'error');
                    return;
                } else {
                    paymentObject = {
                        paymentMethod,
                        customerName,
                        customerPhone
                    }
                }
            }

            const bookingDetails = {
                room: data.name,
                roomid: data._id,
                roomtype: data.type,
                userid: JSON.parse(localStorage.getItem("currentUser"))._id,
                fromdate,
                todate,
                totalprice: totalPrice,
                totaldays: totalDays,
                paymentMethod: paymentObject
            }

            setLoading(true);
            const response = await axios.post('/api/bookings/bookingRoom', bookingDetails);
            setLoading(false);
            Swal.fire({
                icon: 'success',
                title: 'Booking Success!',
                text: 'Your booking has been placed successfully!',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/profile/2';
            });
        } catch (error) {
            setLoading(false);
            console.error(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                confirmButtonText: 'OK'
            });
        }
    }

    return (
        <div  style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Navbar />
        <div className="mgB" style={{width:"50%"  ,height:"400px",   marginLeft : "auto", marginRight: "auto"}}>
       
            
            {loading ? <Loader /> : data ? (
                <div>
                    <div className='row justify-content-center mt-5 bs'>
                        <div className='col'>
                            <h1>{data.name}</h1>
                            {data && data.imageurls && data.imageurls[0] && (
                                <img src={data.imageurls[0]} alt={data.name} className='bigimg' />
                            )}
                        </div>
                        <div className='col'>
                            <div style={{ textAlign: 'right' }}>
                                <h1>Booking Details</h1>
                                <hr />
                                <b>
                                    <p>Name: {JSON.parse(localStorage.getItem("currentUser"))?.name}</p>
                                    <p>From Date: {fromdate}</p>
                                    <p>To Date: {todate}</p>
                                    <p>Max Count: {data.maxcount}</p>
                                </b>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <b>
                                    <hr />
                                    <h1>Payment Details</h1>
                                    <p>Total Days: {totalDays}</p>
                                    <p>Price Per Day: {data.rentperday} $</p>
                                    <p>Total Price: {totalPrice} $</p>
                                </b>
                            </div>
                            <div style={{ float: 'right' }}>
                                <button className='btn btn-primary' onClick={handleShow}>Pay Now</button>
                            </div>
                            <Modal show={show} onHide={handleClose} size="lg">
                                <Modal.Header closeButton>
                                    <Modal.Title>Payment Method</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <select className='form-control'
                                        value={paymentMethod} onChange={(e) => { setPaymentMethod(e.target.value) }}>
                                        <option value='PromptPay'>PromptPay</option>
                                        <option value='Credit-Card'>Credit-Card</option>
                                        <option value='Cash'>Cash</option>
                                    </select>
                                    <hr />
                                    {paymentMethod === 'PromptPay' && (
                                        <div>
                                            <img className="d-block w-100 photo"
                                                src={"https://cdn.discordapp.com/attachments/1077852800005984316/1111651578823315546/1685108778496.jpg"}
                                                alt="TaiChiRichBoi" />
                                            <hr />
                                            <div>
                                                <section className="container">
                                                    <div className="formInput">
                                                        <label htmlFor="file">
                                                            Image: <DriveFolderUploadIcon className="icon" />
                                                        </label>
                                                        <input
                                                            type="file"
                                                            id="file"
                                                            onChange={handleFileChange}
                                                            style={{ display: "none" }}
                                                        />
                                                    </div>
                                                    <aside>
                                                        <div className="left">
                                                            {fileURLs.map((fileURL, index) => (
                                                                <div className="left" key={index}>
                                                                    <img src={fileURL} alt="" className='smallimg' />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </aside>
                                                </section>
                                            </div>
                                        </div>
                                    )}
                                    {paymentMethod === 'Credit-Card' && (
                                        <div>
                                            <h5>Credit Card Details</h5>
                                            <input type='text' placeholder='Name on card : EX. John Website' className='form-control' value={cardHolderName} onChange={(e) => { setCardHolderName(e.target.value) }} />
                                            <input type='text' placeholder='Card number : 1234 5678 9012 3456' className='form-control' value={cardNumber} onChange={(e) => { setCardNumber(e.target.value) }} />
                                           <div className='row'> <div className='col'> <input type='text' placeholder='Expiry date : 01/19' className='form-control col' value={cardExpireDate} onChange={(e) => { setCardExpireDate(e.target.value) }} /></div>
                                           <div className='col'> <input type='text' placeholder='Card CVV : 123' className='form-control col' value={cardCVV} onChange={(e) => { setCardCVV(e.target.value) }} /></div></div> </div>
                                    )}
                                    {paymentMethod === 'Cash' && (
                                        <div>
                                            <h5>Customer Details</h5>
                                            <input type='text' placeholder='Customer Name' className='form-control' value={customerName} onChange={(e) => { setCustomerName(e.target.value) }} />
                                            <input type='text' placeholder='Customer Phone Number' className='form-control' value={customerPhone} onChange={(e) => { setCustomerPhone(e.target.value) }} />
                                        </div>
                                    )}

                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={bookingRoom}>
                                        Comfirm Payment
                                    </Button>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Back
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                    </div> ) : <Error message={'Something went wrong! Please try again later'} />}
        </div>
        </div>
    )
}

export default Bookingscreen;