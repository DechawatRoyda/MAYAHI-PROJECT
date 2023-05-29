import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Chartscreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [totalByCategory, setTotalByCategory] = useState([]);
  const [paymentPop, setPaymentPop] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalBookingsByRoomType, setTotalBookingsByRoomType] = useState([]);
  const [foodTypePopularity, setFoodTypePopularity] = useState([]);
  const [boardgamePopularity, setBoardgamePopularity] = useState([]);

  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!user || !user.isAdmin) {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get('/api/bookings/getRoomTypePopularity');
        setData(response);
        const { data: response2 } = await axios.get('/api/transactions/getTotalAmount');
        setTotal(response2.total);
        console.log(response2);
        const { data: response3 } = await axios.get('/api/transactions/getTotalAmountByEachCategory');
        setTotalByCategory(response3);
        console.log(response3);
        const { data: response4 } = await axios.get('/api/transactions/getPaymentMethodPopularity');
        setPaymentPop(response4);
        console.log(response4);
        const { data: response5 } = await axios.get('/api/bookings/totalBookings');
        setTotalBookings(response5);
        console.log(response5);
        const { data: response6 } = await axios.get('/api/bookings/totalBookingsByRoomType');
        setTotalBookingsByRoomType(response6);
        console.log(response6);
        const { data: response7 } = await axios.get('/api/foods/getFoodTypePopularity');
        setFoodTypePopularity(response7);
        console.log(response7);
        const { data: response8 } = await axios.get('/api/borrowboardgames/getBoardgamePopularity');
        setBoardgamePopularity(response8);
        console.log(response8);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //sort function
  const sortObject = (obj) => {
    const sortedData = Object.entries(obj).sort((a, b) => b[1] - a[1]);
    return Object.fromEntries(sortedData);
  };

  return (
    <div>
      <div className="row justify-content-center p-3">
        <div className="col-md-10 bs">
          <h2>Room Type Popularity</h2>
          <table className="table table-striped table-bordered table-responsive-sm">
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Number of Bookings</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sortObject(data)).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-10 bs">
          <h2>Food Category Popularity</h2>
          <table className="table table-striped table-bordered table-responsive-sm">
            <thead>
              <tr>
                <th>Food Category</th>
                <th>Number of Orders</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sortObject(foodTypePopularity)).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-10 bs">
          <h2>Boardgame Category Popularity</h2>
          <table className="table table-striped table-bordered table-responsive-sm">
            <thead>
              <tr>
                <th>Boardgame Category</th>
                <th>Number of Borrowings</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sortObject(boardgamePopularity)).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-10 d-flex justify-content-center">
          <div className='bs'>
            <h2 >Total Income</h2>
            <h2 className='text-center mt-4'>{total}</h2>
          </div>
          <div className='ml-5 bs'>
            <h2>Total Income By Each Category</h2>
            <p>Room Booking: {totalByCategory.totalRoomBooking}</p>
            <p>Food Order: {totalByCategory.totalFoodOrder}</p>
            <p>Boardgame Borrowing: {totalByCategory.totalBoardgameBorrowing}</p>
          </div>
        </div>
        <div className="col-md-10 d-flex justify-content-center">
          <div className='bs'>
            <h2>Payment Method Popularity</h2>
            <p>Cash: {paymentPop.cash}</p>
            <p>Credit-Card: {paymentPop.creditcard}</p>
            <p>PromptPay: {paymentPop.promptpay}</p>
          </div>
        </div>
        <div className="col-md-10 d-flex justify-content-center">
          <div className='bs'>
            <h2>Total Bookings</h2>
            <h2 className='text-center mt-6'>{totalBookings}</h2>
          </div>
          <div className='ml-5 bs'>
            <h2>Total Bookings By Each Room Type</h2>
            {Object.entries(totalBookingsByRoomType).map(([key, value]) => (
              <p key={key}>{key}: {value}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chartscreen;
