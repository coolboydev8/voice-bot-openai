import React from "react";
import useResponsive from "../hook/useResponsive";
import { useState, useEffect, useRef } from "react";
import { redirect, useParams, useNavigate } from "react-router-dom";
import { Card, Result, Row, Typography } from "antd";
import Http from "../utils/http";
import { getUserId } from "../utils/auth";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { logout } from "../utils/auth";
const Mark = () => {
  const { isMobile, isTablet } = useResponsive();
  const [isLoading, setLoading] = useState(true);
  const [mark, setMark] = useState("Nothing to show");
  const id = useParams();
  const [score, setScore] = useState({});
  const [overall, setOverall] = useState({});
  const [suggestion, setSuggestion] = useState({});
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
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
  const fetchData = async () => {
    if (id.id) {
      const user_id = await getUserId();
      await Http.post("/mark/getMark", { user_id, topic_num: id.id }).then(
        (result) => {
          setResponse(result.data.score);
        }
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="header">
        <Row justify="space-between">
          <HomeOutlined
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
      <div
        style={{
          position: "absolute",
          top: "9vh",
          backgroundImage: `url('../assets/days/Day${id.id}.png')`,
          borderRadius: "20px",
          backgroundSize: "cover",
          width: "90%",
          height: "90%",
        }}
      >
        <StyledCard
          style={{
            width: "100%",
            height: "100%",
            padding: "0px",
            background: "#1A1245BD",
          }}
        >
          <div
            style={{
              borderRadius: "0px",
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <h1>Overview</h1>
            <pre
              style={{
                width: "100%",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {response}
            </pre>
          </div>
        </StyledCard>
      </div>
    </>
  );
};
export default Mark;
