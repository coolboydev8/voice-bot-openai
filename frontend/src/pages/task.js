import React from "react";
import useResponsive from "../hook/useResponsive";
import { Button, Form, Input, Card, Col, Row, Divider, Typography } from "antd";
import {
  ThunderboltOutlined,
  LeftCircleOutlined,
  VerticalLeftOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Http from "../utils/http";
import { getUserId } from "../utils/auth";
import { openNotification } from "../utils/notification";


const Task = () => {
  const { isMobile, isTablet } = useResponsive();
  const id = useParams();
  const [question, setQuestion] = useState({
    title: "Talk about your self",
    task1: "say something your self",
    task2: "Say why you are good fit for the role",
  });
  const img_url = `/assets/days/Day${id.id}.png`;
  useEffect(() => {
    if (id.id) {
      Http.post("/task/getTaskList", id).then((result) => {
        if (result) {
          let topic = result.data.result;
          setQuestion({
            task1: topic.task1,
            task2: topic.task2,
            title: topic.title,
          });
        }
      });
    }
  }, [id]);

  const mobileStatus = (
    <Card
      title={
        <>
          <LeftCircleOutlined />
          <marquee>{question.title}</marquee>
        </>
      }
      headStyle={{ fontSize: "1.25em", maxWidth: "80vw" }}
      style={{
        height: "90vh",
        width: "90vw",
      }}
    >
      <Row>
        <Col
          style={{
            minHeight: "100%",
            minWidth: "100%",
            padding: "0",
            margin: "0",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            alignContent: "space-around",
            justifyContent: "center",
          }}
        >
          <div>
            <img
              src={img_url}
              alt="IMG"
              style={{ maxWidth: "200px", height: "auto", marginBottom: "15%" }}
            />
          </div>

          <div>
            <Typography>
              <pre>{question.task1}</pre>
            </Typography>
            <Typography>
              <pre>{question.task2}</pre>
            </Typography>
          </div>
          <Button
            icon={<ThunderboltOutlined />}
            style={{ marginTop: "10%" }}
            size="large"
          >
            <Link to={`/chat/${id.id}`} onClick={async () => {

              const user_id = await getUserId();
              await Http.post("/task/createHistoy", { user_id: user_id._id, topic_day: id.id, flag: true })
                .then(() => {
                  console.log("-----------------------------");
                }).catch((err) => {
                  if (err) {
                    openNotification("warning", "please check your network");
                  }
                });
            }}  >Start Conversation</Link>
          </Button>
        </Col>
      </Row>
    </Card>
  );

  const tabletStatus = (
    <Card
      title={<marquee>{question.title}</marquee>}
      headStyle={{ fontSize: "20px" }}
      style={{
        minWidth: "80vw",
        minHeight: "70vh",
      }}
    >
      <Row style={{ minHeight: "600px", minWidth: "400px" }}>
        <Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src={img_url}
              alt="IMG"
              style={{ maxWidth: "200px", height: "auto" }}
            />
          </div>
        </Col>
        <Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Divider
            orientation="left"
            style={{ fontSize: "30px", borderColor: "#9053c7" }}
            dashed
          >
            Task
          </Divider>
          <div>
            <Typography>
              <pre>{question.task1}</pre>
            </Typography>
            <Typography>
              <pre>{question.task2}</pre>
            </Typography>
          </div>
          <Button
            icon={<ThunderboltOutlined />}
            style={{ marginTop: "10%" }}
            size="large"
          >
            <Link to={`/chat/${id.id}`} onClick={async () => {

              const user_id = await getUserId();
              Http.post("/task/createHistoy", { user_id: user_id._id, topic_day: id.id, flag: true })
                .then(() => {
                  console.log("-----------------------------");
                }).catch((err) => {
                  if (err) {
                    openNotification("warning", "please check your network");
                  }
                });
            }}
            >Start Conversation</Link>
          </Button>
        </Col>
      </Row>
    </Card>
  );
  const desktopStatus = (
    <Card
      title={question.title}
      headStyle={{ fontSize: "25px" }}
      style={{
        maxWidth: "90vw",
        maxHeight: "90vh",
      }}
    >
      <Row style={{ minHeight: "600px", minWidth: "700px" }}>
        <Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src="assets/days/Day2.png"
              alt="IMG"
              style={{ maxWidth: "300px", height: "auto" }}
            />
          </div>
        </Col>
        <Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Divider
            orientation="left"
            style={{ fontSize: "30px", borderColor: "#9053c7" }}
            dashed
          >
            Task
          </Divider>
          <div>
            <Typography>
              <pre>{question.task1}</pre>
            </Typography>
            <Typography>
              <pre>{question.task2}</pre>
            </Typography>
          </div>
          <Button
            icon={<ThunderboltOutlined />}
            style={{ marginTop: "10%" }}
            size="large"

          >
            <Link to={`/chat/${id.id}`} onClick={async () => {

              const user_id = await getUserId();
              await Http.post("/task/createHistoy", { user_id: user_id._id, topic_day: id.id, flag: true })
                .then(() => {
                  console.log("-----------------------------");
                }).catch((err) => {
                  if (err) {
                    openNotification("warning", "please check your network");
                  }
                });
            }}>Start Conversation</Link>
          </Button>
        </Col>
      </Row>
    </Card>
  );

  return isMobile ? (
    <>{mobileStatus}</>
  ) : (
    <>{isTablet ? tabletStatus : desktopStatus}</>
  );
};

export default Task;
