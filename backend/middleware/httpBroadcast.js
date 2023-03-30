import axios from "axios";

const endpointBase = "http://backend{}:5000/api";
const server_list = process.env.OTHER_SERVERS.split(",");
const server_id = process.env.SERVER_ID;

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
        let headers = {}
        if (token != "")
            headers = { "Authorization": "Bearer " + token };
        let url = endpointBase.replace(/{}/g, element) + endpoint;
        axios
            .post(url, reqBody, { headers: headers, timeout: 1000 })
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
        let headers = {}
        if (token != "")
            headers = { "Authorization": "Bearer " + token };
        let url = endpointBase.replace(/{}/g, element) + endpoint;
        axios
            .put(url, reqBody, { headers: headers, timeout: 1000 })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    });
}

export const deleteBroadCast = async (endpoint, reqBody, token) => {
    server_list.forEach((element) => {
        if (server_id === element) return;
        reqBody.isBroadcast = true;
        let headers = {}
        if (token != "")
            headers = { "Authorization": "Bearer " + token };
        let url = endpointBase.replace(/{}/g, element) + endpoint;
        axios
            .delete(url, { headers: headers, timeout: 1000 })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    });
}
