
import usePersistStore from "@app/store/persist";
import { APP, BASE_URI, SERVER_URL } from "@app/utils/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { getPost, getPostAssociations, getUserProfile } from "./videos";

export const GetSuggestedFeed = async (reader, limit = 32, seenPosts, current_id) => {
    const response = await axios.post(`${SERVER_URL}/suggested-feed`, { limit, seenPosts, current_id });
    const posts = response.data.data;
    if (posts && posts.length > 0) {
        // for( let i = 0; i < posts.length; i++) {
        //     const userProfile = await getUserProfile(posts[i].user_id)
        //     posts[i].ProfileEntryResponse = userProfile
        //     if (posts[i].posthash !== null) {
        //         const chainPost = await getPost(posts[i].posthash, reader)
        //         const associationsCount = await getPostAssociations(posts[i].posthash)
        //         posts[i].Post = chainPost
        //         posts[i].AssociationsCount = associationsCount
        //     }
        // }
        return posts
    } else {
        return []
    }
}

export const FetchSuggestedFeed = (limit, output, current_id) => {
    const user = usePersistStore((state) => state.user)
    const isLoggedIn = usePersistStore((state) => state.isLoggedIn)
    const reader = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check;
    const recentlyWatched = usePersistStore((state) => state.recentlyWatched)
    return useInfiniteQuery(['suggested-feed'], ({ pageParam = 0 }) => GetSuggestedFeed(limit, reader, output, pageParam, current_id),
        {
            getNextPageParam: (lastPage, pages) => {
                if(lastPage === null) {
                    return null;
                } else {
                    //let last = lastPage[lastPage.length - 1];
                    //console.log({ pages: pages, watched: recentlyWatched })
                    return 0;
                }
            }
        }
    );
}