import axios from "axios";
import { apiUrl } from "../config";

export const callApi = async ({ method, endpoint, body }) => {
    const response = await axios({
      method,
      url: `${apiUrl}${endpoint}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: body,
    });
  
    return response?.data;
  };