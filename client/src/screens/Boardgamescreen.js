import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { Modal, Button, Carousel } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useDropzone } from "react-dropzone";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

function Boardgamescreen() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedBoardgames, setselectedBoardgames] = useState([]);
    const [show, setShow] = useState(false);
    const [totalprice, setTotalprice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('PromptPay');
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpireDate, setCardExpireDate] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [duplicateData, setDuplicateData] = useState([])
    const [searchkey, setSearchkey] = useState('')
    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('currentUser'))) {
            window.location.href = '/login';
        }
    }, []);

    const [files, setFiles] = useState([]);
    const [fileURLs, setFileURLs] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        const fileURLsArray = Array.from(selectedFiles).map((file) => URL.createObjectURL(file));
        setFileURLs(fileURLsArray);
        setFiles(selectedFiles);
        console.log(selectedFiles, fileURLsArray);
    };

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: response } = await axios.get('/api/boardgames/getBoardgames');
                const boardgamesWithCount = response.map(boardgame => ({
                    ...boardgame,
                    count: 0,
                    totalprice: 0
                }));
                setData(boardgamesWithCount);
                setDuplicateData(boardgamesWithCount);
                const categories = [...response.map(boardgame => boardgame.CategoryName).filter(onlyUnique), 'All'];
                setCategory(categories);
                console.log(category);
                setLoading(false);
                console.log(response);
            } catch (error) {
                setError(true);
                setLoading(false);
                console.error(error.message);
            }
        };

        fetchData();
    }, []);

    const incrementCount = (index) => {
        setData(prevData => {
            const updatedData = [...prevData];
            updatedData[index] = { ...updatedData[index], count: updatedData[index].count + 1 };
            return updatedData;
        });
    };

    const decrementCount = (index) => {
        setData(prevData => {
            const updatedData = [...prevData];
            if (updatedData[index].count > 0) {
                updatedData[index] = { ...updatedData[index], count: updatedData[index].count - 1 };
            }
            return updatedData;
        });
    };

    const handleSelectedBoardgame = () => {
        const selected = data.filter(boardgame => boardgame.count > 0);
        if (selected.length === 0) {
            alert('Please select at least one boardgame');
            return;
        } else {
            setTotalprice(selected.reduce((acc, boardgame) => acc + (boardgame.count * boardgame.lendingPrice), 0));
            selected.forEach(boardgame => boardgame.totalprice = boardgame.count * boardgame.lendingPrice);
            setselectedBoardgames(selected);
            console.log(selected);
            handleShow();
        }
    };

    async function borrowGames() {
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

            const boardgame = {
                userid: JSON.parse(localStorage.getItem('currentUser'))._id,
                boardgames: selectedBoardgames.map(boardgame => ({
                    boardgameid: boardgame._id,
                    name: boardgame.name,
                    category: boardgame.CategoryName,
                    count: boardgame.count,
                    lendingPrice: boardgame.lendingPrice,
                    totalprice: boardgame.totalprice,
                })),
                totalprice: totalprice,
                paymentMethod: paymentObject
            }
            console.log(boardgame);

            const response = await axios.post('/api/borrowboardgames/borrowBoardgame', boardgame);
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Boardgame Borrowing Requested Successfully!',
                text: "Don't forget to return the boardgames on time!",
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/profile/5';
            });
        } catch (error) {
            console.error(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                confirmButtonText: 'OK'
            });
        }
    }

    const filterBySearch = () => {
        const tmpRoom = duplicateData.filter(data =>
            data.name.toLowerCase().includes(searchkey.toLowerCase())
        );
        setData(tmpRoom);
    };

    const filterByType = (e) => {
        const selectedType = e.target.value;
        setSelectedCategory(selectedType);
        console.log(selectedType);

        if (selectedType === 'All') {
            setData(duplicateData);
        } else {
            const filteredData = duplicateData.filter((data) =>
                data.CategoryName.toLowerCase() === selectedType.toLowerCase()
            );
            setData(filteredData);
        }
    };

    return (
        <div className='row justify-content-center mt-5'>

            <div className='col-md-6'>
                {loading && <Loader />}
                {error && <Error />}
                <div className='justify-content-center mt-5'>
                    <div className='row mt-5 bs'>
                        <div className='col-md-5'>
                            <input type='text' placeholder='Search by boardgame name' className='form-control'
                                value={searchkey} onChange={(e) => { setSearchkey(e.target.value) }} onKeyUp={filterBySearch} />
                        </div>
                        <div className='col-md-2'>
                            <select className='form-control'
                                value={selectedCategory} onChange={filterByType}>
                                {category.map((category) => (
                                    <option value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {data && data.map((boardgame, index) => {
                        return (
                            <div className='row bs' key={boardgame.id}>
                                <div className='col-md-4 center mt-5'>
                                    <img src={boardgame.img} alt={boardgame.name} className='smallimg zoom' />
                                </div>
                                <div className='text-left w-100 mt-5 col-md-7'>
                                    <h1>{boardgame.name}</h1>
                                    <hr />
                                    <p>
                                        <b>Description:</b>{" "}
                                        {showFullDescription ? boardgame.description : boardgame.description.slice(0, 100)}
                                        {boardgame.description.length > 100 && (
                                            <span>
                                                {!showFullDescription && (
                                                    <button className="morebtn" onClick={toggleDescription}>
                                                        ...more
                                                    </button>
                                                )}
                                                {showFullDescription && (
                                                    <button className="morebtn" onClick={toggleDescription}>
                                                        ...less
                                                    </button>
                                                )}
                                            </span>
                                        )}
                                    </p>

                                    <p><b>Category:</b> {boardgame.CategoryName}</p>
                                    <p><b>Lending Price:</b> {boardgame.lendingPrice} $</p>
                                    <hr />
                                    <div className="d-flex flex-row" style={{ float: 'right' }}>
                                        <button className="button1" onClick={() => decrementCount(index)}>-</button>
                                        <p className='ml-2 mr-2 mt-3'>{boardgame.count}</p>
                                        <button className="button1" onClick={() => incrementCount(index)}>+</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="col-md-12 mt-5 text-center">
                        <button className="btn btn-primary float-button" onClick={handleSelectedBoardgame}>Proceed to Payment</button>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Selected Boardgames</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {selectedBoardgames.map(boardgame => (
                            <li key={boardgame.id} style={{ textAlign: 'justify' }}>{boardgame.name} - {boardgame.count} - {boardgame.totalprice} $ </li>
                        ))}
                    </ul>
                    <hr />
                    <h3 style={{ textAlign: 'right' }}>Total Price: {totalprice} $</h3>
                    <hr />
                    <h5>Payment Method</h5>
                    <hr />
                    <select className='form-control' value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
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
                            <input type='text' placeholder='CardHolder Name' className='form-control' value={cardHolderName} onChange={(e) => { setCardHolderName(e.target.value) }} />
                            <input type='text' placeholder='Card Number' className='form-control' value={cardNumber} onChange={(e) => { setCardNumber(e.target.value) }} />
                            <input type='text' placeholder='Card ExpireDate' className='form-control' value={cardExpireDate} onChange={(e) => { setCardExpireDate(e.target.value) }} />
                            <input type='text' placeholder='Card CVV' className='form-control' value={cardCVV} onChange={(e) => { setCardCVV(e.target.value) }} />
                        </div>
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
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={borrowGames}>
                        Proceed to Payment
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Boardgamescreen;
