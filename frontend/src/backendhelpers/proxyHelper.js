import axios from "axios";

const proxyBase =
  process.env.REACT_APP_PROXY_URL || "http://localhost:4000/api";

export const getBackendUrl = async () => {
  return await axios.get(proxyBase + "/server").then((res) => {
    return { 
      'serverURL': res.data.serverURL,
      'websocketURL': res.data.websocketURL,
    }
  });
};
