import { SERVER_URL } from "@app/utils/constants";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getPost, getPostAssociations, getUserProfile } from "./videos";

export const getWatchLater = async (reader, video_id) => {
    const response = await axios.post(`${SERVER_URL}/watchlater`, { user_id: reader, video_id: video_id })
    return response.data.data;
}

export const removeWatchLater = async (reader, video_id) => {
    return await axios.post(`${SERVER_URL}/remove-watchlater`, { user_id: reader, video_id: video_id })
}

export const addWatchLater = async (reader, video_id) => {
    return await axios.post(`${SERVER_URL}/add-watchlater`, { user_id: reader, video_id: video_id })
}

export const GetWatchLaterFeed = async (output = 32, reader, offset) => {
    const response = await axios.post(`${SERVER_URL}/watchlater-videos`, { limit: output, user_id: reader, offset: offset })
    const posts = response.data.data;
    if (posts && posts.length > 0) {
        for( let i = 0; i < posts.length; i++) {
            const userProfile = await getUserProfile(posts[i].videos.user_id)
            posts[i].ProfileEntryResponse = userProfile
            if (posts[i].posthash !== null) {
                const chainPost = await getPost(posts[i].posthash, reader)
                const associationsCount = await getPostAssociations(posts[i].posthash)
                posts[i].Post = chainPost
                posts[i].AssociationsCount = associationsCount
            }
        }
        return posts
    } else {
        return []
    }
}

export const FetchWatchLaterFeed = (limit, reader) => {
    return useQuery(['watchlater-feed'], () => GetWatchLaterFeed(limit, reader));
}

export const FetchInfiniteWatchLaterFeed = (limit, reader) => {
    return useInfiniteQuery(['infinite-watchlater-feed'], ({ pageParam = 0 }) => GetWatchLaterFeed(limit, reader, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                console.log(lastPage.nextCursor)
                if(lastPage === null) {
                    return 0;
                } else {
                    return lastPage.nextCursor;
                }
            }
        }
    );
}