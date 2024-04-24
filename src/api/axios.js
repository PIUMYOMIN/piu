import axios from "axios";

export default axios.create({
  baseURL: "https://piueducation.org/api/v1",
  withCredentials: true
});
