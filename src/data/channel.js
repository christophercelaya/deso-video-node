import usePersistStore from "@app/store/persist";
import { BASE_URI } from "@app/utils/constants";
import { supabase } from "@app/utils/functions/getSupabaseClient";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { fetchAllPosts } from "./api";
import { getVideoExtraData } from "@app/utils/functions/getVideoExtraData";

// export const GetProfileFeed = async ({ queryKey }) => {
//     const [_key, { username, reader, lastPost, limit, output }] = queryKey;
//     const endpoint = 'get-posts-for-public-key';
//     const lastid = (lastPost !== 0 && lastPost !== undefined) ? `${lastPost}` : ``;
//     const nLimit = (limit && limit !== -1) ? limit : 2500
//     const response = await axios.post(`${BASE_URI}/${endpoint}`, {
//         Username: username,
//         ReaderPublicKeyBase58Check: reader,
//         LastPostHashHex: lastid,
//         NumToFetch: nLimit,
//         MediaRequired: true,
//     });
//     if (response === null) {
//         return null
//     } else {
//         const posts = response.data.Posts;
//         const filtered = posts.filter(post => {
//             if (post.VideoURLs !== null && post.VideoURLs.length > 0 && post.VideoURLs[0] !== '') {
//                 return post
//             }
//         });

//         const filteredPosts = filtered.splice(0, output)
//     console.log(filtered)

//         return {posts:filteredPosts, LastPostHashHex: response.data.LastPostHashHex}
//     }
// }

export const GetProfileFeed = async (publicKey, limit, reader, lastPost, output = 32) => {
    // const { data: posts, error } = await supabase.from('videos').select('*').limit(output).eq('user', publicKey).order('created_at', { ascending: false });
    const endpoint = 'get-posts-for-public-key';
    const nLimit = (limit && limit !== -1) ? limit : 2500
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        PublicKeyBase58Check: publicKey,
        ReaderPublicKeyBase58Check: reader,
        LastPostHashHex: lastPost,
        NumToFetch: nLimit,
        MediaRequired: true,
    });
    if (response === null) {
        return null
    } else {
        const posts = response.data.Posts;

        if (posts !== null) {
            const filtered = posts.filter(post => {
                const extraData = getVideoExtraData(post);
                if (post.VideoURLs !== null && post.VideoURLs.length > 0 && post.VideoURLs[0] !== '' || extraData !== null) {
                console.log('post', post.PostHashHex, extraData)
                    return post
                }
            });
                console.log(filtered)

            const filteredPosts = filtered.splice(0, output)
            
            return filtered
        }
        return []
    }
    // if (posts && posts.length > 0) {
    //     const postsList = posts.map((post) => {
    //         return post.posthash
    //     })
    //     const fullPosts = await fetchAllPosts(reader, postsList);
    //     return fullPosts
    // } else {
    //     console.log(error)
    //     return []
    // }
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