import React from "react";
import { Button, Card, Row } from "antd";
import {
  CheckSquareOutlined,
  LogoutOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Http from "../utils/http";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getUserId } from "../utils/auth";
import { Header } from "antd/es/layout/layout";
import { logout } from "../utils/auth";
import { openNotification } from "../utils/notification";
const StyledCard = styled.div`
  border-width: 2px;
  background: #1034e663;
  border: 2px solid hsla(0, 0%, 100%, 0.7);
  width: 80%;
  maxwidth: 600px;
  height: 80%;
  border-radius: 20px;
  border: none;
  overflow-y: auto;
  padding: 20px;
`;
const StyledButton = styled(Button)`
  height: 50px;
  color: white;
  background-color: #69b1ff;
  border-radius: 30px;
  width: 90%;
  font-size: 22px;
  font-weight: 600;
  border: none;
  &.ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
    color: white;
    background-color: #3b43e7;
    border-radius: 30px;
  }
  &:active {
    background-color: #454dec;
    border-radius: 30px;
  }
`;
const { Meta } = Card;
const Topic = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [topic, setTopic] = useState({});
  const img_url = `/assets/days/Day${params.id}.png`;
  useEffect(() => {
    if (params.id) {
      Http.post("/task/getTaskList", params).then((result) => {
        if (result) {
          let topic1 = result.data.result;
          console.log(topic1);
          setTopic({
            task1: topic1.task1,
            task2: topic1.task2,
            task1Desc: topic1.task1Dec,
            task2Desc: topic1.task2Dec,
            title: topic1.title,
            topicDesc: topic1.tDesc,
          });
        }
      });
    }
  }, [params]);
  const createHistoy = async () => {
    const user_id = await getUserId();
    Http.post("/task/createHistoy", {
      user_id: user_id._id,
      topic_day: params.id,
      flag: true,
    })
      .then(() => {
        console.log("-----------------------------");
      })
      .catch((err) => {
        if (err) {
          openNotification("warning", "please check your network");
        }
      });
  };
  return (
    <>
      <div className="header">
        <Row justify="space-between">
          <LeftCircleOutlined
            onClick={() => navigate("/topiclist")}
            style={{ fontSize: "25px", marginLeft: "10px" }}
          />
          <LogoutOutlined
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{ fontSize: "25px", marginRight: "10px" }}
          />
        </Row>
      </div>
      <StyledCard>
        <h3 style={{ marginTop: "5px" }}>{topic.title}</h3>
        <img
          alt="example"
          src={img_url}
          style={{ width: "100%", height: "33%", borderRadius: "18px" }}
        />

        <div style={{ textAlign: "left" }}>
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "400",
            }}
          >
            {topic.topicDesc}
          </h4>
          <Row>
            <CheckSquareOutlined style={{ fontSize: "24px" }} />
            <h1
              style={{
                marginTop: "0px",
                marginBottom: "0px",
                marginLeft: "10px",
              }}
            >
              Task
            </h1>
          </Row>
          <h3 style={{ marginBottom: "5px", fontSize: "24px" }}>
            1.{topic.task1}
          </h3>
          <h4 style={{ marginTop: "0px", fontSize: "18px", color: "gray" }}>
            {topic.task1Desc}
          </h4>
          <h3 style={{ marginBottom: "5px", fontSize: "24px" }}>
            2.{topic.task2}
          </h3>
          <h4 style={{ marginTop: "0px", fontSize: "18px", color: "gray" }}>
            {topic.task2Desc}
          </h4>
        </div>
      </StyledCard>
      {props.type ? (
        <StyledButton
          style={{ marginTop: "10px", width: "86%" }}
          onClick={() => {
            createHistoy();
            navigate(`/chat/${params.id}`);
          }}
        >
          Start Conversation
        </StyledButton>
      ) : (
        <StyledButton
          style={{ marginTop: "10px", width: "86%" }}
          onClick={() => {
            navigate(`/chat/${params.id}`);
          }}
        >
          Review Conversation
        </StyledButton>
      )}
    </>
  );
};

export default Topic;
