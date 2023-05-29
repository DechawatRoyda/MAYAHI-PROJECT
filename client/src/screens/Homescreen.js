import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

const Homesceen = () => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [duplicateData, setDuplicateData] = useState([])

    const [searchkey, setSearchkey] = useState('')
    const [roomtype, setRoomtype] = useState('all')

    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: response } = await axios.get('/api/rooms/getRooms');
                setData(response);
                setDuplicateData(response);
                const categories = [...response.map(room => room.type).filter(onlyUnique), 'All'];
                setCategory(categories);
                console.log(category);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
                console.error(error.message);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (fromDate !== null && toDate !== null) {
            const filteredData = duplicateData.filter(room => {
                let availability = true;
                if (room.currentbookings.length > 0) {
                    for (const booking of room.currentbookings) {
                        if (
                            isBetween(fromDate, booking.fromdate, booking.todate) ||
                            isBetween(toDate, booking.fromdate, booking.todate)
                        ) {
                            availability = false;
                            break;
                        }
                    }
                }
                return availability;
            });
            setData(filteredData);
        }
    }, [fromDate, toDate, duplicateData]);

    function isBetween(dateToCheck, startDate, endDate) {
        const d1 = startDate.split('-');
        const d2 = endDate.split('-');
        const c = dateToCheck.split('-');

        const from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]); // -1 because months are from 0 to 11
        const to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
        const check = new Date(c[2], parseInt(c[1]) - 1, c[0]);

        return check >= from && check <= to;
    }

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            const fromDate = dates[0].format('DD-MM-YYYY');
            const toDate = dates[1].format('DD-MM-YYYY');
            setFromDate(fromDate);
            setToDate(toDate);
        } else {
            setFromDate(null);
            setToDate(null);
        }
    };

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
                data.type.toLowerCase() === selectedType.toLowerCase()
            );
            setData(filteredData);
        }
    };


    return (
        <div className='container'>
            <div className='row mt-5 bs'>
                <div className='col-md-3'>
                    <RangePicker format='DD-MM-YYYY' onChange={handleDateChange} />
                </div>
                <div className='col-md-5'>
                    <input type='text' placeholder='Search by room name' className='form-control'
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
            <div className='row justify-content-center mt-5'>
                {loading ? <Loader /> :
                    (data.map((room =>
                        <div className='col-md-9 mt-3'>
                            <Room room={room} fromDate={fromDate} toDate={toDate} />
                        </div>)))
                }
            </div>
        </div>
    )
}

export default Homesceen;