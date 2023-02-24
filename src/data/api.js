import { APP, BASE_NODE_URI } from "@utils/constants";
import axios from "axios";

export const submitTransaction = async (hex) => {
    const endpoint = 'submit-transaction';
    const response = await axios.post(`${BASE_NODE_URI}/${endpoint}`, { TransactionHex: hex });
    return response.data;
}

export const getVideoStatus = async (videoId) => {
    const endpoint = 'get-video-status';
    return await axios.get(`${BASE_NODE_URI}/${endpoint}/${videoId}`);
}

export const fetchStreamSession = async (videoId) => {
    const endpoint = 'session';
    return await axios.post(`${APP.API_URL}/${endpoint}`, {
        asset_id: videoId
    });
}