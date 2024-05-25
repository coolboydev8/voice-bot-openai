import axios from "axios";
const Http = axios.create({
  baseURL: "http://localhost:3001/api/",
});
export default Http;
