import { SERVER_URL } from "@app/utils/constants";
import axios from "axios";
import { getPost, getPostAssociations, getUserProfile } from "./videos";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const GetHistoryFeed = async (limit, reader, page = 0) => {
    const response = await axios.post(`${SERVER_URL}/history`, { limit: limit, user_id : reader, page: page })
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

export const FetchHistoryFeed = (limit, reader) => {
    return useQuery(['history-feed'], () => GetHistoryFeed(limit, reader));
}

export const FetchInfiniteHistoryFeed = async (limit, reader) => {
    return useInfiniteQuery(['infinite-history-feed'], ({ pageParam = 0 }) => GetHistoryFeed(limit, reader, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                if(lastPage === null) {
                    return 0;
                } else {
                    return lastPage.nextCursor;
                }
            }
        }
    );
}

export const addToHistory = async(video_id, user_id) => {
    try {
        const { data } = await axios.post(`${SERVER_URL}/add-to-history`, { video_id, user_id });
        return data.data
    } catch (error) {
        console.log('added-to-history', error.message);
    }
}