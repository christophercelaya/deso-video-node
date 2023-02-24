import axios from "axios";
import { getVideoExtraData } from "./getVideoExtraData";

export const getVideoThumbnail = (video, duration = 0) => {
    const extraData = getVideoExtraData(video);
    const url = video.VideoURLs[0]
    const replacedUrl = url.replace('iframe.', '')
    const thumbnail = (extraData && extraData.Thumbnail) ? { url: extraData.Thumbnail, processed: true } : { url: `${replacedUrl}/thumbnails/thumbnail.jpg?time=${duration}&height=1080`, processed: false };
    return thumbnail;
}

export const getLivePeerVideoThumbnail = async(videoId, duration = 1) => {
    try {
        const url = `https://thumbnails.withlivepeer.com/api/generate?playbackId=${videoId}&width=&height=&format=webp&time=${duration}`
        return await axios.get(url).then((response) => {
            if (response.data.success) {
                return response.data.image
            }
        })
    } catch (error) {
        console.log('livepeer-thumbnail', error)
    }
}