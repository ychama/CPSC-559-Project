import axios from "axios";

const endpointBase = "http://backend{}:5000/api"
const server_list = process.env.OTHER_SERVERS.split(",")
const server_id = process.env.SERVER_ID

/*const customConfig = {
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};*/

export const postBroadCast = async (endpoint, reqBody, token) => {
    server_list.forEach(element => {
        if (server_id === element) return;
        reqBody.isBroadcast = true;
        let url = endpointBase.replace(/{}/g, element) + endpoint;
        axios
            .post(url, reqBody, { headers: { "Authorization": "Bearer " + token }, timeout: 1000 })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    });
}

export const putBroadCast = async (endpoint, reqBody, token) => {
    server_list.forEach(element => {
        if (server_id === element) return;
        reqBody.isBroadcast = true;
        let url = endpointBase.replace(/{}/g, element) + endpoint;
        axios
            .put(url, reqBody, { headers: { "Authorization": "Bearer " + token }, timeout: 1000 })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    });
}

export const deleteBroadCast = async (endpoint, reqBody, token) => {
    // TODO
} 