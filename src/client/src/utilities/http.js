import axios from "axios";

const getApiOrigin = () => {
  const configured = import.meta.env.VITE_API_ORIGIN;
  if (configured) return configured;

  const { protocol, hostname, port, origin } = window.location;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  // In local Vite preview, requests should hit the Node API server on 3001.
  if (isLocalhost && port && port !== '3001') {
    return `${protocol}//${hostname}:3001`;
  }

  return origin;
};

export const callApi = async ({ method, endpoint, body }) => {
    const apiOrigin = getApiOrigin();
    const response = await axios({
      method,
      url: `${apiOrigin}${endpoint}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: body,
    });
  
    return response?.data;
  };