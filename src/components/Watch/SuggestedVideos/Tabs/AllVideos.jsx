import { SuggestedVideosShimmer } from '@components/Shimmers/WatchVideoShimmer'
import { GetSuggestedFeed } from '@data/suggested'
import useAppStore from '@store/app'
import usePersistStore from '@store/persist'
import { getShuffleArray } from '@utils/functions/getShuffleArray'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import SuggestedVideoCard from '../VideosCard'

function AllVideos({video, currentVideoId}) {
    const {query: { id }} = useRouter()
    const { ref, inView } = useInView()
    const setUpNextVideo = useAppStore((state) => state.setUpNextVideo)
    const recentlyWatched = usePersistStore((state) => state.recentlyWatched)
    const user = usePersistStore((state) => state.user)
    const isLoggedIn = usePersistStore((state) => state.isLoggedIn)
    const reader = isLoggedIn ? user.PublicKeyBase58Check : '';
    const { isSuccess, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage, data: videos } = useInfiniteQuery(['suggested-feed'], ({ pageParam = recentlyWatched }) => GetSuggestedFeed(reader, 15, pageParam, currentVideoId),
        {
            enabled: !!currentVideoId,
            getNextPageParam: (lastPage, pages) => {
                if(lastPage === null) {
                    return null;
                } else {
                    //let last = lastPage[lastPage.length - 1];
                    //console.log({ pages: pages, watched: recentlyWatched })
                    return recentlyWatched;
                }
            }

        }
    );
    if (isError) {
        console.log('error', error)
    }

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [inView, fetchNextPage])

    const channel = video.ProfileEntryResponse;

    return (
        <>
            {isSuccess ? (
                videos.pages.map(page => 
                page.map(video => {
                  return (
                    <SuggestedVideoCard userProfile={video.ProfileEntryResponse} key={`${video.id}`} video={video} />
                  )
                })
              )
            ): <SuggestedVideosShimmer />}
        
        </>
    )
}

export default AllVideos