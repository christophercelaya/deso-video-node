import { BASE_URI, SERVER_URL } from "@app/utils/constants";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getPost, getPostAssociations, getUserProfile } from "./videos";

export const GetProfileFeed = async (profileID, limit = 32, reader, page) => {
   const response = await axios.post(`${SERVER_URL}/user-videos`, { limit: limit, user_id: profileID, page: page })
    const posts = response.data.data;
    if (posts && posts.length > 0) {
        const posts = response.data.data;
        for( let i = 0; i < posts.length; i++) {
            const userProfile = await getUserProfile(posts[i].user_id)
            const chainPost = await getPost(posts[i].posthash, reader)
            const associationsCount = await getPostAssociations(posts[i].posthash)
            posts[i].ProfileEntryResponse = userProfile
            posts[i].Post = chainPost
            posts[i].AssociationsCount = associationsCount
        }
        return posts
    } else {
        return []
    }
}

export const FetchInfiniteProfileFeed = (profileID, limit, reader, pageParam) => {
    return useInfiniteQuery(['infinite-profile-feed'], ({ pageParam = 0 }) => GetProfileFeed(profileID, limit, reader, pageParam),
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

export const GetSingleProfile = async ({ queryKey }) => {
    const [_key, { username }] = queryKey;
    const endpoint = 'get-single-profile';
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        Username: username,
    });
    if (response === null) {
        return null
    } else {
        const profile = response.data.Profile;
        return profile
    }
}

export const FetchProfile = (username) => {
    return useQuery([['single-profile', username], { username }], GetSingleProfile,
        {
            enabled: !!username,
            keepPreviousData: true,
        }
    );
}

export const GetSingleProfileStats = async (username) => {
    const endpoint = 'get-single-profile';
    const requestURL = 'https://desocialworld.com/microservice-enriched/v1/get-single-profile';
    const response = await axios.post(requestURL, {
        Username: username,
    }).then(res => {
        const userAge = response.data.Profile.UserAge;
        const UserGeo = response.data.Profile.UserGeo;
        const UserLanguages = response.data.UserLanguages;
        return { userAge, UserGeo, UserLanguages }
    });
}

export const FetchProfileStats = (username) => {
    return useQuery([['single-profile-stats', username], { username }], GetSingleProfileStats,
        {
            enabled: !!username,
            keepPreviousData: true,
        }
    );
}