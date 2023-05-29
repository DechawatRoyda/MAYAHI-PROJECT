import React from "react";
import { Tabs } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { Divider, Space, Tag } from "antd";
import { useParams } from "react-router-dom";
import Chartscreen from "./Chartscreen";
import TransactionScreen from "./Transactionscreen";
import Alluserscreen from "./Alluserscreen";
import Requestscreen from "./Requestscreen";
import Navbar from "../components/Navbar";

const { TabPane } = Tabs;

function Adminscreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user || !user.isAdmin) {
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
          <TabPane tab="My Admin Profile" key="1">
            <div className="row">
              <div className="col-md-6">
                <div className="flex-container bs">
                  <div className="text-left w-100 m-1">
                    <h1>My Admin Profile</h1>
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
          <TabPane tab="Dashboard" key="2">
            <Chartscreen />
          </TabPane>
          <TabPane
            tab="All transactions"
            key="3"
            style={{ textAlign: "center" }}
          >
            <TransactionScreen />
          </TabPane>
          <TabPane tab="All Users" key="4" style={{backgroundColor:"white"}}>
            <Alluserscreen />
          </TabPane>
          <TabPane tab="All Event Requests" key="5">
            <Requestscreen />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Adminscreen;
