import { useRouter } from 'next/router'
import Custom500 from '@pages/404'
import Custom404 from '@pages/500'
import { useEffect, useState } from 'react'
import { WatchVideoShimmer } from '@components/Shimmers/WatchVideoShimmer'
import usePersistStore from '@store/persist'
import useAppStore from '@store/app'
import AboutChannel from './AboutChannel'
import SuggestedVideos from './SuggestedVideos'
import Video from './Video'
import { getSinglePost } from '@data/videos'
import { useQuery } from '@tanstack/react-query'
import { APP } from '@utils/constants'
import { NextSeo } from 'next-seo'
import { Comments } from './Comments'
import { addToHistory } from '@app/data/history'
import dynamic from 'next/dynamic'
//const WatchVideoShimmer = dynamic(() => import('../Shimmers/WatchVideoShimmer'), { ssr: false })

const WatchVideo = () => {
    const router = useRouter()
    const addToRecentlyWatched = usePersistStore((state) => state.addToRecentlyWatched)
    const setVideoWatchTime = useAppStore((state) => state.setVideoWatchTime)
    const user = usePersistStore((state) => state.user)
    const isLoggedIn = usePersistStore((state) => state.isLoggedIn)
    const reader = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check;

    const { isLoading, isError, error, isFetched, data: video } = useQuery([['single-post', router?.query.id], { id: router?.query.id, reader: reader }], getSinglePost, { enabled: !!router?.query.id })

    useEffect(() => {
        const { t } = router.query
        if (t) {
            setVideoWatchTime(Number(t))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video])

    useEffect(() => {
        if (video && isFetched) {
            addToRecentlyWatched(video)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video, isFetched])
    
    useEffect(() => {
        if (isLoggedIn && video) {
            addToHistory(video?.id, reader)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video, isLoggedIn])

    if (isError) {
        return <Custom500 />
    }

    if (isFetched && !video) {
        return <Custom404 />
    }

    if (isLoading) {
        return (
            <WatchVideoShimmer />
        )
    }
    if(isFetched && !isLoading && !isError && video){
        return (
            <>
                <NextSeo
                    title={video ? video?.title : 'Watch'}
                    description={video ? video?.title : 'Watch'}
                    canonical={`${APP.URL}/watch/${router.asPath}`}
                    openGraph={{
                        title: video ? video?.title : 'Watch',
                        description: video ? video?.title : 'Watch',
                        url: `${APP.URL}/watch/${router.asPath}`,
                        images: [
                            {
                                url: video ? video?.thumbnail : '',
                                alt: video ? video?.title : 'Watch',
                            },
                        ],
                    }}
                />
                
                <div className="w-full flex md:flex-row flex-col  md:-mt-5">
                    <div className="flex md:pr-6 md:flex-1 flex-col space-y-4">
                        <Video video={video} />
                        <AboutChannel video={video} />
                        <Comments video={video} />
                    </div>
                    <div className="w-full md:min-w-[300px] md:max-w-[400px]">
                        <SuggestedVideos video={video} currentVideoId={video?.id} />
                    </div>
                </div>
            </>
        )
    }    
}

export default WatchVideo