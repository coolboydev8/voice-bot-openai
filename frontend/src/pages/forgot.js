import React from "react";
import { Button, Form, Input, Card, Col, Row, notification } from "antd";
import useResponsive from "../hook/useResponsive";
import { useNavigate } from "react-router-dom";
import Http from "../utils/http";
function Forgot() {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();
  const onFinish = (values) => {
    Http.post("/auth/forgot", values)
      .then(async (result) => {
        navigate("/");
        notification.success({
          message: 'Login Success',
          description: 'Welcome to Rasa Chatbot.',
        });
      })
      .catch((err) => {
        if (err.response.data.errors)
          notification.error({
            message: 'Login Failed',
            description: 'User email or password incorrect!',
          });
      });
  };

  const mobileStatus = (
    <Card
      style={{
        minWidth: "80vw",
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
      }}
      bodyStyle={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <Row
        style={{
          minHeight: "30%",
          alignItems: "center",
        }}
      >
        <b
          style={{ fontSize: "1.375em", textAlign: "center", minWidth: "70vw" }}
        >
          What is your email?
        </b>
      </Row>
      <Row>
        <Form style={{ minWidth: "70vw" }} onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Email!",
              },
            ]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button
              className="submit"
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#57b846",
                cursor: "pointer",
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </Card>
  );

  const tabletStatus = (
    <Card
      style={{
        minWidth: "80vw",
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Row style={{ minHeight: "100%" }}>
        <Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column-reverse",
          }}
        >
          <img
            src="assets/login.png"
            alt="IMG"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Col>
        <Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <b
            style={{
              fontSize: "1.2em",
              textAlign: "center",
              minWidth: "30vw",
              padding: "20px",
            }}
          >
            What is your email?
          </b>
          <Form style={{ minWidth: "30vw" }} onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email!",
                },
              ]}
            >
              <Input type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Button
                className="submit"
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#57b846",
                  cursor: "pointer",
                }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
  const desktopStatus = (
    <Card
      style={{
        maxWidth: "90vw",
        maxHeight: "90vh",
        display: "flex",
        justifyContent: "center",
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
          <img
            src="assets/login.png"
            alt="IMG"
            style={{ maxWidth: "70%", height: "auto" }}
          />
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
          <b
            style={{
              fontSize: "1.875em",
              textAlign: "center",
              minWidth: "300px",
              padding: "40px",
            }}
          >
            What is your email?
          </b>
          <Form style={{ width: "300px" }} onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email!",
                },
              ]}
            >
              <Input type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Button
                className="submit"
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#57b846",
                  cursor: "pointer",
                }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );

  return isMobile ? (
    <>{mobileStatus}</>
  ) : (
    <>{isTablet ? tabletStatus : desktopStatus}</>
  );
}

export default Forgot;
