import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker, Space } from "antd";
import { Modal, Button, Carousel } from "react-bootstrap";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";

const { RangePicker } = DatePicker;

function Eventscreen() {
  const [data, setData] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [eventType, setEventType] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [eventDetails, setEventDetails] = useState("");
  const [eventRequirements, setEventRequirements] = useState([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get("/api/events/getEvents");
        setData(response);
        console.log(response);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const fromDate = dates[0].format("DD-MM-YYYY");
      const toDate = dates[1].format("DD-MM-YYYY");
      setFromDate(fromDate);
      setToDate(toDate);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  function isBetween(dateToCheck, startDate, endDate) {
    const d1 = startDate.split("-");
    const d2 = endDate.split("-");
    const c = dateToCheck.split("-");

    const from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]); // -1 because months are from 0 to 11
    const to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
    const check = new Date(c[2], parseInt(c[1]) - 1, c[0]);

    return check >= from && check <= to;
  }

  const handleAddRequirement = () => {
    if (newRequirement) {
      const updatedRequirements = [...eventRequirements, newRequirement];
      setEventRequirements(updatedRequirements);
      setNewRequirement("");
      handleClose();
    }
  };

  const handleDeleteRequirement = (index) => {
    const updatedRequirements = [...eventRequirements];
    updatedRequirements.splice(index, 1);
    setEventRequirements(updatedRequirements);
  };

  const handleSubmit = async () => {
    if (
      !companyName ||
      !companyEmail ||
      !companyPhone ||
      !companyAddress ||
      !eventType ||
      !fromDate ||
      !toDate ||
      !eventDetails ||
      eventRequirements.length === 0
    ) {
      return Swal.fire("Error!", "Please fill all the fields.", "error");
    }

    const existingEvents = data.filter((event) => {
      return (
        isBetween(fromDate, event.fromDate, event.toDate) ||
        isBetween(toDate, event.fromDate, event.toDate)
      );
    });

    if (existingEvents.length > 0) {
      return Swal.fire(
        "Error!",
        "Event dates clash with other events.",
        "error"
      );
    }

    const event = {
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      eventType,
      fromDate,
      toDate,
      eventDetails,
      eventRequirements,
    };
    try {
      setLoading(true);
      await axios.post("/api/events/createEvent", event);
      setLoading(false);
      Swal.fire("Success!", "Event created successfully.", "success").then(
        (result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.href = "/profile/4";
          }
        }
      );
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error(error.message);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  return (
    <div>
      {loading && <Loader />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          <div className="row">
            <div className="bs">
              <h3 className="d-flex justify-content-center">Event Planning</h3>
              <h5 className="mt-3">Company Name</h5>
              <input
                type="text"
                placeholder="Company Name"
                className="form-control"
                value={companyName}
                required
                onChange={(e) => {
                  setCompanyName(e.target.value);
                }}
              />

              <div className="row">
                <div className="col">
                  <h5 className="mt-2">Company Email</h5>
                  <input
                    type="text"
                    placeholder="Company Email"
                    className="form-control"
                    value={companyEmail}
                    required
                    onChange={(e) => {
                      setCompanyEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="col-auto">
                  <h5 className="mt-2">Company Phone</h5>
                  <input
                    type="text"
                    placeholder="Company Phone"
                    className="form-control"
                    value={companyPhone}
                    required
                    onChange={(e) => {
                      setCompanyPhone(e.target.value);
                    }}
                  />
                </div>
              </div>

              <h5 className="mt-2">Company Address</h5>
              <input
                type="text"
                placeholder="Company Address"
                className="form-control"
                value={companyAddress}
                required
                onChange={(e) => {
                  setCompanyAddress(e.target.value);
                }}
              />

              <div className="row">
                <div className="col">
                  <h5 className="mt-2">Event Type</h5>
                  <input
                    type="text"
                    placeholder="Event Type"
                    className="form-control"
                    value={eventType}
                    required
                    onChange={(e) => {
                      setEventType(e.target.value);
                    }}
                  />
                </div>
                <div className="col-auto">
                  <h5 className="mt-2">Event Date</h5>
                  <Space direction="vertical" size={12}>
                    <RangePicker
                      format="DD-MM-YYYY"
                      onChange={handleDateChange}
                    />
                  </Space>
                </div>
              </div>

              <h5 className="mt-2">Event Details</h5>
              <input
                type="text"
                placeholder="Event Details"
                className="form-control"
                value={eventDetails}
                required
                onChange={(e) => {
                  setEventDetails(e.target.value);
                }}
              />
              <h5 className="mt-2">Event Requirements</h5>
              <button className="btn btn-primary" onClick={handleShow}>
                Add Requirement
              </button>
              <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>Add Event Requirement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input
                    type="text"
                    placeholder="Requirement"
                    className="form-control"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleAddRequirement}>
                    Add Requirement
                  </Button>
                  <Button variant="secondary" onClick={handleClose}>
                    Back
                  </Button>
                </Modal.Footer>
              </Modal>
              <h5 className="mt-2">Requirements list:</h5>
              {eventRequirements.length === 0 ? (
                <p>No requirements added.</p>
              ) : (
                <ul className="bs">
                  {eventRequirements.map((requirement, index) => (
                    <li key={index} className="ml-2">
                      {requirement}
                      <button
                        className="btn px-2 btn-sm ml-2 smallbtn"
                        onClick={() => handleDeleteRequirement(index)}
                      >
                        -
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                className="btn bigbtn justify-content-center mt-5 "
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Eventscreen;
