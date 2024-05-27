import React, { useEffect, useState } from "react";
import { Card, Row, Col, List, Badge } from "antd";
import styled from "styled-components";
import {
  LockOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import Http from "../utils/http";
import { getUserId } from "../utils/auth";
import { new_double } from "lamejs/src/js/common";
import { logout } from "../utils/auth";

const StyledCard = styled.div`
  border-width: 2px;
  background: #1034e62b;
  border: 2px solid hsla(0, 0%, 100%, 0.7);
  width: 80%;
  maxwidth: 600px;
  height: 80%;
  border-radius: 20px;
  padding: 20px;
  overflow-y: auto;
`;
const LockDiv = styled.div`
  width: 100%; // Adjust size as needed
  height: 100px; // Adjust size as needed
  background: #333; // Dark background
  display: flex;
  justify-content: center;
  align-items: center;
  color: white; // Adjust the color of the SVG if needed
`;

const TopicList = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [lastTime, setLastTime] = useState(new Date());
  const [topicArray, setTopicArray] = useState([]);
  const [possiblility, setPossibility] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const dataList = [];
    for (var i = 1; i <= 30; i++) {
      dataList.push({ day: i });
    }
    setTopicArray(dataList);
    getProgress();
  }, []);
  useEffect(() => {}, [currentDay, lastTime]);
  const getProgress = async () => {
    try {
      const user_id = await getUserId();
      console.log(user_id);
      console.log(user_id._id);
      const progressResult = await Http.post("/task/getProgress", {
        user_id: user_id._id,
      });
      if (progressResult.data.result.length) {
        setCurrentDay(progressResult.data.result.length + 1);
        const array = progressResult.data.result.sort((a, b) => {
          return a.tpoic_day - b.topic_day;
        });
        setLastTime(array[0].created_at);
        const currentDate = new Date();
        const lstime = new Date(array[0].created_at);
        let remainSeconds = 86400000 - (currentDate - lstime);
        console.log(remainSeconds);
        if (remainSeconds <= 0) {
          setPossibility(true);
        } else {
          setPossibility(false);
        }
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  return (
    <>
      <div className="header">
        <Row style={{ display: "flex", flexDirection: "row-reverse" }}>
          <LogoutOutlined
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{ fontSize: "25px", marginRight: "10px", float: "right" }}
          />
        </Row>
      </div>
      <StyledCard>
        <List
          grid={{
            gutter: 26,
            xs: 2,
            sm: 3,
            md: 3,
            lg: 5,
            xl: 5,
            xxl: 5,
          }}
          dataSource={topicArray}
          renderItem={(item, index) => {
            return (
              <List.Item>
                {item.day < currentDay ? (
                  <Badge.Ribbon text={"Day" + item.day} color="blue">
                    <div
                      style={{
                        backgroundImage: `url('./assets/days/Day${item.day}.png')`,
                        height: "110px",
                        backgroundSize: "cover",
                        borderRadius: "10%",
                      }}
                    >
                      <div
                        onClick={() => navigate(`/review/${item.day}`)}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "10%",
                          display: "flex",
                          justifyContent: "center",
                          background: "#73c7539c",
                        }}
                      >
                        <EyeOutlined style={{ fontSize: "45px" }} />
                      </div>
                    </div>
                  </Badge.Ribbon>
                ) : item.day == currentDay ? (
                  <Badge.Ribbon text={"Day" + item.day} color="green">
                    <div
                      style={{
                        backgroundImage: `url('./assets/days/Day${item.day}.png')`,
                        height: "110px",
                        backgroundSize: "cover",
                        borderRadius: "10%",
                      }}
                    >
                      {possiblility ? (
                        <div
                          onClick={() => navigate(`/topic/${item.day}`)}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "10%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <PlayCircleOutlined
                            style={{ fontSize: "45px", color: "#63f41c" }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "10%",
                            display: "flex",
                            justifyContent: "center",
                            background: "#14a7d142",
                          }}
                        >
                          <ClockCircleOutlined
                            style={{ fontSize: "45px", color: "#1cf4e8" }}
                          />
                        </div>
                      )}
                    </div>
                  </Badge.Ribbon>
                ) : (
                  <div
                    style={{
                      backgroundImage: `url('./assets/days/Day${item.day}.png')`,
                      height: "110px",
                      backgroundSize: "cover",
                      borderRadius: "10%",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10%",
                        display: "flex",
                        justifyContent: "center",
                        background: "#9053c7ba",
                      }}
                    >
                      <LockOutlined style={{ fontSize: "45px" }} />
                    </div>
                  </div>
                )}
              </List.Item>
            );
          }}
        ></List>
      </StyledCard>
    </>
  );
};

export default TopicList;
