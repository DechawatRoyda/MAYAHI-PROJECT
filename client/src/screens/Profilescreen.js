import React from "react";
import { Tabs } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { Divider, Space, Tag } from "antd";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
const { TabPane } = Tabs;

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  const { key } = useParams();

  return (
    <div
      className=" text-center"
    >
      <div className="ml-3 mt-3">
        <Tabs defaultActiveKey={key} centered>
          <TabPane tab="My Profile" key="1">
            <div className="row">
              <div className="col-md-6">
                <div className="flex-container bs">
                  <div className="text-left w-100 m-1">
                    <h1>My Profile</h1>
                    <br />
                    <p>
                      <b>Name:</b> {user.name}
                    </p>
                    <p>
                      <b>Email:</b> {user.email}
                    </p>
                    <p>
                      <b>IsAdmin:</b> {user.isAdmin ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="My Bookings" key="2">
            <MyBooking />
          </TabPane>
          <TabPane tab="My Orders" key="3">
            <MyOrder />
          </TabPane>
          <TabPane tab="My Event Requests" key="4">
            <MyEvent />
          </TabPane>
          <TabPane tab="My Borrowed Boardgames" key="5">
            <MyBorrow />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Profilescreen;

export function MyBooking() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          `/api/bookings/getBookingsByUserId/${user._id}`
        );
        console.log(response);
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  function cancelBooking(bookingid, roomid) {
    const cancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (cancel) {
      const cancelBooking = async () => {
        try {
          setLoading(true);
          const { data: response } = await axios.put(
            `/api/bookings/cancelBooking`,
            { bookingid, roomid }
          );
          console.log(response);
          window.location.href = "/profile/2";
          setLoading(false);
        } catch (error) {
          setError(true);
          setLoading(false);
          console.error(error.message);
        }
      };
      cancelBooking();
    }
  }

  return (
    <div>
      {loading && <Loader />}
      <div className="row">
        <div className="col-md-6">
          {data &&
            data.map((booking) => {
              return (
                <div className="flex-container bs">
                  <div className="text-left w-100 m-1">
                    <h1>Booking Details</h1>
                    <hr />
                    <p>
                      <b>Room Name:</b> {booking.room}
                    </p>
                    <p>
                      <b>Booking ID:</b> {booking._id}
                    </p>
                    <p>
                      <b>Check-In:</b> {booking.fromdate}
                    </p>
                    <p>
                      <b>Check-Out:</b> {booking.todate}
                    </p>
                    <p>
                      <b>Price:</b> {booking.totalprice} $
                    </p>

                    <hr />
                    <h1>Payment Details</h1>
                    <hr />
                    <p>
                      <b>Payment Method:</b>{" "}
                      {booking.paymentMethod[0].paymentMethod}
                    </p>
                    <p>
                      <b>Booking Status:</b>{" "}
                      {booking.status === "waiting" ? (
                        <Tag color="orange">Waiting</Tag>
                      ) : booking.status === "booked" ? (
                        <Tag color="green">Booked</Tag>
                      ) : (
                        <Tag color="volcano">Cancelled</Tag>
                      )}
                    </p>
                  </div>
                  {(booking.status === "booked" ||
                    booking.status == "waiting") && (
                    <div className="text-right">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          cancelBooking(booking._id, booking.roomid);
                        }}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export function MyOrder() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          `/api/orders/getOrdersByUserId/${user._id}`
        );
        console.log(response);
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  function cancelEvent(orderid) {
    const cancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (cancel) {
      const cancelEvent = async () => {
        try {
          setLoading(true);
          const { data: response } = await axios.put(
            `/api/orders/cancelOrder`,
            { orderid }
          );
          console.log(response);
          window.location.href = "/profile/3";
          setLoading(false);
        } catch (error) {
          setError(true);
          setLoading(false);
          console.error(error.message);
        }
      };
      cancelEvent();
    }
  }

  return (
    <div>
      {loading && <Loader />}
      <div className="row">
        <div className="col-md-6">
          {data &&
            data.map((order) => {
              return (
                <div className="flex-container bs">
                  <div className="text-left w-100 m-1">
                    <h1>Order Details</h1>
                    <hr />
                    <ul>
                      {order.orderitems.map((food) => (
                        <li key={food.id} style={{ textAlign: "justify" }}>
                          <p>
                            <b>Food Name:</b> {food.name}
                          </p>
                          <p>
                            <b>Quantity:</b> {food.count}
                          </p>
                          <p>
                            <b>Price:</b> {food.totalprice} $
                          </p>
                        </li>
                      ))}
                    </ul>
                    <hr />
                    <h1>Payment Details</h1>
                    <hr />
                    <p>
                      <b>Payment Method:</b>{" "}
                      {order.paymentMethod[0].paymentMethod}
                    </p>
                    <p>
                      <b>Order Status:</b>{" "}
                      {order.status === "cooking" ? (
                        <Tag color="orange">Cooking</Tag>
                      ) : order.status === "done" ? (
                        <Tag color="green">Done</Tag>
                      ) : (
                        <Tag color="volcano">Cancelled</Tag>
                      )}
                    </p>
                  </div>
                  {order.status === "cooking" && (
                    <div className="text-right">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          cancelEvent(order._id);
                        }}
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export function MyEvent() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          `/api/events/getEventById/${user._id}`
        );
        console.log(response);
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  function cancelEvent(eventid) {
    const cancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (cancel) {
      const cancelEvent = async () => {
        try {
          setLoading(true);
          const { data: response } = await axios.put(
            `/api/events/cancelEvent`,
            { eventid }
          );
          console.log(response);
          window.location.href = "/profile/4";
          setLoading(false);
        } catch (error) {
          setError(true);
          setLoading(false);
          console.error(error.message);
        }
      };
      cancelEvent();
    }
  }

  return (
    <div>
      {loading && <Loader />}
      <div className="row">
        <div className="col-md-6">
          {data &&
            data.map((event) => {
              return (
                <div className="flex-container bs">
                  <div className="text-left w-100 m-1">
                    <h1>Event Details</h1>
                    <ul>
                      <li>{event.eventDetails}</li>
                    </ul>
                    <hr />
                    <h1>Event Requirements</h1>
                    <ul>
                      {event.eventRequirements.map((requirement) => (
                        <li
                          key={requirement.id}
                          style={{ textAlign: "justify" }}
                        >
                          {requirement}
                        </li>
                      ))}
                    </ul>
                    <p>
                      <b>Event Status:</b>{" "}
                      {event.status === "waiting" ? (
                        <Tag color="orange">Waiting</Tag>
                      ) : event.status === "approved" ? (
                        <Tag color="green">Approved</Tag>
                      ) : (
                        <Tag color="volcano">Cancelled</Tag>
                      )}
                    </p>
                  </div>
                  {event.status === "waiting" && (
                    <div className="text-right">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          cancelEvent(event._id);
                        }}
                      >
                        Cancel Event
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export function MyBorrow() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          `/api/borrowboardgames/getBorrowsByUserId/${user._id}`
        );
        console.log(response);
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  function returnBoardgame(borrowid) {
    const cancel = window.confirm(
      "Are you sure you want to return the boardgames?"
    );
    if (cancel) {
      const returnBoardgame = async () => {
        try {
          setLoading(true);
          const { data: response } = await axios.put(
            `/api/borrowboardgames/returnBoardgame`,
            { borrowid }
          );
          console.log(response);
          window.location.href = "/profile/5";
          setLoading(false);
        } catch (error) {
          setError(true);
          setLoading(false);
          console.error(error.message);
        }
      };
      returnBoardgame();
    }
  }

  return (
    <div>
      {loading && <Loader />}
      <div className="row">
        <div className="col-md-6">
          {data &&
            data.map((boardgame) => {
              return (
                <div className="flex-container bs">
                  <div className="text-left w-100 m-1">
                    <h1>Borrowing Details</h1>
                    <hr />
                    <ul>
                      {boardgame.boardgames.map((games) => (
                        <li key={games.id} style={{ textAlign: "justify" }}>
                          <p>
                            <b>Boardgame Name:</b> {games.name}
                          </p>
                          <p>
                            <b>Quantity:</b> {games.count}
                          </p>
                          <p>
                            <b>Price:</b> {games.totalprice} $
                          </p>
                        </li>
                      ))}
                    </ul>
                    <hr />
                    <h1>Payment Details</h1>
                    <hr />
                    <p>
                      <b>Payment Method:</b>{" "}
                      {boardgame.paymentMethod[0].paymentMethod}
                    </p>
                    <p>
                      <b>Borrow Status:</b>{" "}
                      {boardgame.status === "borrowing" ? (
                        <Tag color="orange">Borrowing</Tag>
                      ) : (
                        <Tag color="green">Returned</Tag>
                      )}
                    </p>
                  </div>
                  {boardgame.status === "borrowing" && (
                    <div className="text-right">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          returnBoardgame(boardgame._id);
                        }}
                      >
                        Return Boardgame
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
