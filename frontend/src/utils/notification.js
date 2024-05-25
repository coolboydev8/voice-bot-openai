import React from "react";
import { notification } from "antd";
export const openNotification = (type, description) => {
  notification[`${type}`]({ description: description });
};
