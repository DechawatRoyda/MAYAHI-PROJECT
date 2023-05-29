import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2';
import { Divider, Space, Tag } from 'antd';

function TransactionScreen() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [image, setImage] = useState('');
    const [duplicateData, setDuplicateData] = useState([])
    const [searchkey, setSearchkey] = useState('')
    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')


    useEffect(() => {
        if (!user||!user.isAdmin) {
            window.location.href = '/login';
        }
    }, []);

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: response } = await axios.get(`/api/transactions/getAllTransactions`);
                setData(response);
                setDuplicateData(response);
                const categories = [...response.map(transaction => transaction.category).filter(onlyUnique), 'All'];
                setCategory(categories);
                console.log(category);
                setLoading(false);
                console.log(response);
            } catch (err) {
                setError(true);
                setLoading(false);
                console.log(err.message);
            }
        };

        fetchData();
    }, []);

    const filterBySearch = () => {
        const tmpRoom = duplicateData.filter(data =>
            data.userid.toLowerCase().includes(searchkey.toLowerCase())
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
                data.category.toLowerCase() === selectedType.toLowerCase()
            );
            setData(filteredData);
        }
    };

    return (
        <div className='row justify-content-center mt-5'>
            <div className='col-md-6'>
                {loading && <Loader />}
                {error && <Error />}
                <div className='row mt-5 bs'>
                    <div className='col-md-5'>
                        <input type='text' placeholder='Search by UserID' className='form-control'
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
                <div className='justify-content-center mt-5'>
                    {data && data.map(transaction => {
                        return (
                            <div className='flex-container bs'>
                                <div className='text-left w-100 m-1'>
                                    <h1>Transaction Details</h1>
                                    <hr />
                                    <p><b>UserID:</b> {transaction.userid}</p>
                                    <p><b>Transaction ID:</b> {transaction._id}</p>
                                    <p><b>Transaction Date:</b> {transaction.createdAt.substring(0, 10)}</p>
                                    <p><b>Transaction Time:</b> {transaction.createdAt.substring(11, 19)}</p>
                                    <p><b>Transaction Amount:</b> {transaction.amount}</p>
                                    <p><b>Transaction Type:</b> {transaction.category}</p>
                                    <hr />
                                    <h1>Payment Method</h1>
                                    <p>
                                        {transaction.paymentMethod[0].paymentMethod === 'Cash' ?
                                            (<ul>
                                                <li><b>Payment Method:</b> Cash</li>
                                                <li><b>Customer Name:</b> {transaction.paymentMethod[0].customerName}</li>
                                                <li><b>Customer Phone Number:</b> {transaction.paymentMethod[0].customerPhone}</li>
                                            </ul>) :
                                            transaction.paymentMethod[0].paymentMethod === 'Credit-Card' ?
                                                (<ul>
                                                    <li><b>Payment Method:</b> Credit-Card</li>
                                                    <li><b>Card Holder Name:</b> {transaction.paymentMethod[0].cardHolderName}</li>
                                                    <li><b>Card Number:</b> {transaction.paymentMethod[0].cardNumber}</li>
                                                    <li><b>Card Expiry Date:</b> {transaction.paymentMethod[0].cardExpireDate}</li>
                                                    <li><b>Card CVV:</b> {transaction.paymentMethod[0].cardCVV}</li>
                                                </ul>) :
                                                (<ul>
                                                    <li><b>Payment Method:</b> PromptPay</li>
                                                    <li><img src={transaction.paymentMethod[0].img} alt="PromptPay QR Code" className='smallimg' /></li>
                                                </ul>)}
                                    </p>
                                    <p><b>Transaction Status:</b> {transaction.status === 'waiting' ?
                                        <Tag color="orange">Waiting</Tag> :
                                        transaction.status === 'approved' ?
                                            <Tag color="green">Approved</Tag> :
                                            <Tag color="volcano">Cancelled</Tag>}</p>
                                    {/* //Cancel transaction button */}
                                    {transaction.status !== 'cancelled' && (<button className='btn btn-danger m-3' onClick={() => {
                                        Swal.fire({
                                            title: 'Are you sure you want to cancel this transaction?',
                                            text: "You won't be able to revert this!",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Yes, cancel it!'
                                        }).then(async (result) => {
                                            if (result.isConfirmed) {
                                                const { data: response } = await axios.put(`/api/transactions/cancelTransaction/${transaction._id}`);
                                                Swal.fire(
                                                    'Cancelled!',
                                                    'Your transaction has been cancelled.',
                                                    'success'
                                                ).then((result) => {
                                                    window.location.href = '/admin/3';
                                                })
                                            }
                                        })
                                    }}>Cancel Transaction</button>)}
                                    {/* //Approve Button */}
                                    {(transaction.status !== 'approved' && transaction.status !== 'cancelled') && (<button className='btn btn-success m-3' onClick={() => {
                                        Swal.fire({
                                            title: 'Are you sure you want to approve this transaction?',
                                            text: "You won't be able to revert this!",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Yes, approve it!'
                                        }).then(async (result) => {
                                            if (result.isConfirmed) {
                                                const { data: response } = await axios.put(`/api/transactions/approveTransaction/${transaction._id}`);
                                                Swal.fire(
                                                    'Approved!',
                                                    'Your transaction has been approved.',
                                                    'success'
                                                ).then((result) => {
                                                    window.location.href = '/admin/3';
                                                })
                                            }
                                        })
                                    }}>Approve Transaction</button>)}
                                    {/* //Delete Button */}
                                    <button className='btn btn-danger m-3' onClick={() => {
                                        Swal.fire({
                                            title: 'Are you sure you want to delete this transaction?',
                                            text: "You won't be able to revert this!",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Yes, delete it!'
                                        }).then(async (result) => {
                                            if (result.isConfirmed) {
                                                const { data: response } = await axios.delete(`/api/transactions/deleteTransaction/${transaction._id}`);
                                                Swal.fire(
                                                    'Deleted!',
                                                    'Your transaction has been deleted.',
                                                    'success'
                                                ).then((result) => {
                                                    window.location.href = '/admin/3';
                                                })
                                            }
                                        })
                                    }}>Delete Transaction</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default TransactionScreen;
