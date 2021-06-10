import axios from "axios";

const config = {
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
    },
    withCredentials: true
};

const $axios = axios.create({
    ...config,
    baseURL: "/api"
});

export default $axios;
