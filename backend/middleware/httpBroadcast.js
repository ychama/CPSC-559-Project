import axios from "axios";

const endpointBase = process.env.SERVER_BASE_URL
const server_list = process.env.OTHER_SERVERS.split(",")
const server_id = process.env.SERVER_ID

/*const customConfig = {
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};*/

export const postBroadCast = async (endpoint, reqBody) => {
    server_list.forEach(element => {
        if (server_id === element) return;
        reqBody.isBroadcast = true;
        let url = endpointBase.replace(/{}/g, element) + endpoint;
        axios
            .post(url, reqBody, { timeout: 1000 })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    });
}

export const putBroadCast = async (endpoint, reqBody) => {
    server_list.forEach(element => {
        if (server_id === element) return;
        reqBody.isBroadcast = true;
        let url = endpointBase.replace(/{}/g, element) + endpoint;
        axios
            .put(url, reqBody, { timeout: 1000 })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    });
}

export const deleteBroadCast = async (endpoint, reqBody) => {
    // TODO
} 