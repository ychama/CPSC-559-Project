import axios from "axios";

const proxyList = [
  process.env.REACT_APP_PROXY_URL_1 || "http://localhost:4001/api",
  process.env.REACT_APP_PROXY_URL_2 || "http://localhost:4002/api",
  process.env.REACT_APP_PROXY_URL_3 || "http://localhost:4003/api",
  process.env.REACT_APP_PROXY_URL_4 || "http://localhost:4004/api",
];

export const getBackendUrl = async () => {
  let currentProxy, websocketURL, serverURL;
  let availableProxies = [...proxyList];

  while (availableProxies.length) {
    currentProxy =
      availableProxies[Math.floor(Math.random() * availableProxies.length)];
    try {
      const res = await axios.get(currentProxy + "/server").then((res) => {
        console.log(
          "Connected to proxy with URL: " + currentProxy + " successfully."
        );
        return res;
      });
      serverURL = res.data.serverURL;
      websocketURL = res.data.websocketURL;
      break;
    } catch (err) {
      console.log(err);
      console.log("Failed to connect to proxy at URL: " + currentProxy);
      availableProxies = availableProxies.filter(
        (proxy) => proxy != currentProxy
      );
    }
  }
  if (websocketURL && serverURL) {
    return {
      serverURL: serverURL,
      websocketURL: websocketURL,
    };
  } else {
    console.log("Failed to get serverURL/websocketURL from all proxies.");
  }
};
