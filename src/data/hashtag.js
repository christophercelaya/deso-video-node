import { SERVER_URL } from "@app/utils/constants";
import axios from "axios";
import { getPost, getPostAssociations, getUserProfile } from "./videos";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";


export const GetHashtagFeed = async ({ queryKey }) => {
    const [_key, { limit, reader, hashtag, page = 0 }] = queryKey;
    const response = await axios.post(`${SERVER_URL}/get-videos-by-tag`, { limit: limit, tag: hashtag, page: page })
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

export const FetchHashtagFeed =  (limit, reader, hashtag) => {
    return useQuery([['hashtag-feed', hashtag], { hashtag: hashtag, reader: reader, limit: limit }], GetHashtagFeed,
        {
            enabled: !!hashtag,
        }
    );
}

export const FetchInfiniteHashtagFeed =  (limit, reader, hashtag) => {
    return useInfiniteQuery(['infinite-hashtag-feed', hashtag], ({ pageParam = 0 }) => GetHashtagFeed(limit, reader, hashtag, pageParam),
        {
            enabled: !!hashtag,
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