import React from "react";
import { Button, Form, Input, Card, Col, Row, notification } from "antd";
import useResponsive from "../hook/useResponsive";
import { useNavigate, Link } from "react-router-dom";
import { openNotification } from "../utils/notification";
import { login } from "../utils/auth";
import Http from "../utils/http";
import styled from "styled-components";
import "./login.css";
const StyledInput = styled(Input)`
  background-color: #6163666e;
  border-raius: 35px;
  color: white;
  height: 50px;
  font-size: 20px;
  border: none;
  border-bottom: solid 3px;
  border-bottom-color: #4096ff;
  &:hover {
    background-color: #18191a6e; /* Change to your desired hover color */
    border-bottom-color: #1034e6;
  }

  &:active {
    background-color: #18191a6e; /* Change to your desired active color */
  }

  &:selected {
    background-color: #18191a6e; /* Change to your desired active color */
  }

  &:not(:hover) {
    background-color: #6163666e; /* Change to your desired color when pointer is out */
  }
`;
const LoginButton = styled(Button)`
  height: 50px;
  background-color: #6369e5;
  color: white;
  width: 90%;
  font-size: 22px;
  font-weight: 600;
  border: none;
  &.ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
    color: white;
    background-color: #3b43e7;
  }
  &:active {
    background-color: #454dec;
  }
`;
const StyledForm = styled(Form)`
  &
    :where(
      .css-dev-only-do-not-override-1r287do
    ).ant-input-outlined.ant-input-status-error:not(.ant-input-disabled) {
    background: #9d366a6e;
    border: none;
    border-bottom: solid 3px;
    border-bottom-color: #ff4040;
  }
  &
    :where(.css-dev-only-do-not-override-1r287do).ant-form-item
    .ant-form-item-explain-error {
    color: #ff4d4f;
    text-align: left;
    font-size: 18px;
  }
`;
function Login() {
  const form = Form.useForm();
  const navigate = useNavigate();
  const onFinish = (values) => {
    Http.post("/auth/login", values)
      .then(async (result) => {
        if (result.data) await login({ token: result.data.errors.token });
        navigate("/topiclist");
        notification.success({
          message: "Login Success",
          description: "Welcome to Rasa Chatbot.",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Login Failed",
          description: "User email or password is incorrect!",
        });
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    notification.error({
      message: "Login Failed",
      description: "User email or password incorrect!",
    });
  };
  return (
    <div className="login_div">
      <Col style={{ width: "90%" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            marginBottom: "0px",
            color: "white",
            marginTop: "0px",
          }}
        >
          Login
        </h1>
        <h4
          style={{
            paddingBottom: "18px",
            fontWeight: "400",
            paddingTop: "0px",
            marginTop: "0px",
            fontSize: "16px",
            fontWeight: "500",
            color: "#7d8995",
          }}
        >
          Please sign in to your account
        </h4>
        <StyledForm
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <StyledInput placeholder="Email ID"></StyledInput>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <StyledInput bplaceholder="Password" type="password"></StyledInput>
          </Form.Item>
          <Form.Item type="submit">
            <LoginButton htmlType="submit" style={{ marginTop: "20px" }}>
              Log In
            </LoginButton>
          </Form.Item>
        </StyledForm>
      </Col>
    </div>
  );
}

export default Login;
