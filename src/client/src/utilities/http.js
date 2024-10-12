import axios from "axios";

export const callApi = async ({ method, endpoint, body }) => {
    const response = await axios({
      method,
      url: `${window.location.origin}${endpoint}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: body,
    });
  
    return response?.data;
  };