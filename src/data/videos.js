
import usePersistStore from "@app/store/persist";
import { APP, BASE_URI, SERVER_URL } from "@app/utils/constants";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const GetLatestFeed = async (output = 32, reader, offset) => {
    const response = await axios.post(`${SERVER_URL}/latest-videos`, { limit: output, offset: offset })
    const posts = response.data.data;
    if (posts && posts.length > 0) {
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

export const FetchLatestFeed = ({limit}) => {
    return useQuery(['latest-feed'], ({ pageParam = 1 }) => GetLatestFeed(limit, pageParam), {
        keepPreviousData: true,
    });
}

export const FetchInfiniteLatestFeed = (limit, reader) => {
    return useInfiniteQuery(['infinite-latest-feed'], ({ pageParam = 0 }) => GetLatestFeed(limit, reader, pageParam),
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

export const getSinglePost = async ({ queryKey }) => {
    const [_key, { id, reader }] = queryKey;

    const response = await axios.post(`${SERVER_URL}/get-video`, { id });
    if (response?.data && response.data.data.length > 0) {
        const post = response.data.data[0];
        if (post) {
            const userProfile = await getUserProfile(post.user_id)
            const chainPost = await getPost(post.posthash, reader)
            const associationsCount = await getPostAssociations(post.posthash)
            post.ProfileEntryResponse = userProfile
            post.Post = chainPost
            post.AssociationsCount = associationsCount
            return post
        }
        return null
    } else {
        return null
    }
}

export const getUserProfile = async (publicKey) => {
    const { data } = await axios.post(`${BASE_URI}/get-single-profile`, {
        PublicKeyBase58Check: publicKey,
        ReaderPublicKeyBase58Check: APP.PUBLIC_KEY
    })
    return data.Profile
}

export const getPostAssociations = async (posthash) => {
    const { data } = await axios.post(`${BASE_URI}/post-associations/counts`, {
        AssociationType: 'REACTION',
        AssociationValues: [
            'LIKE',
            'DISLIKE',
        ],
        PostHashHex: posthash,
    })
    return data.Counts
}

export const getPost = async (posthash, reader) => {
    const {data} = await axios.post(`${BASE_URI}/get-single-post`, {
        PostHashHex: posthash,
        ReaderPublicKeyBase58Check: reader,
        CommentLimit: 10,
    })
    return data.PostFound
}

export const FetchSinglePost = ({id}) => {
    const user = usePersistStore((state) => state.user)
    const isLoggedIn = usePersistStore((state) => state.isLoggedIn)
    const reader = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check;
    return useQuery([['single-post', id], { id, reader }], getSinglePost, {
        keepPreviousData: true,
    });
}