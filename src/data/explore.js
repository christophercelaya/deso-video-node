import { SERVER_URL } from "@app/utils/constants";
import axios from "axios";
import { getPost, getPostAssociations, getUserProfile } from "./videos";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";


export const GetCategoryFeed = async ({ queryKey }) => {
    const [_key, { limit, reader, category, page = 0 }] = queryKey;
    const response = await axios.post(`${SERVER_URL}/category`, { limit: limit, category: category, page: page })
    const posts = response.data.data;
    if (posts && posts.length > 0) {
        for( let i = 0; i < posts.length; i++) {
            const userProfile = await getUserProfile(posts[i].user_id)
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

export const FetchCategoryFeed =  (limit, reader, category) => {
    return useQuery([['category-feed', category], { category: category, reader: reader, limit: limit }], GetCategoryFeed,
        {
            enabled: !!category,
        }
    );
}

export const FetchInfiniteCategoryFeed =  (limit, reader, category) => {
    return useInfiniteQuery(['infinite-category-feed', category], ({ pageParam = 0 }) => GetCategoryFeed(limit, reader, category, pageParam),
        {
            enabled: !!category,
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