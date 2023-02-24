import VideoCard from '@components/Common/Cards/Video'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer';
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react';
import usePersistStore from '@store/persist';
import { NoDataFound } from '@components/UI/NoDataFound';
import { FetchInfiniteWatchLaterFeed } from '@app/data/watchlater';
import { Loader2 } from '@app/components/UI/Loader';


const WatchedVideos = () => {
  const { ref, inView } = useInView()
  const user = usePersistStore((state) => state.user)
  const isLoggedIn = usePersistStore((state) => state.isLoggedIn)
  const reader = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check;
  const { isError, error, isSuccess, hasNextPage, isFetchingNextPage, fetchNextPage, data: videos } = FetchInfiniteWatchLaterFeed(32, reader);  

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage])

  if (isError) {
    return <NoDataFound 
      isCenter
      withImage
      title="Something went wrong"
      description="We are unable to fetch the latest videos. Please try again later."
    />
  }

  if (videos?.pages[0]?.length === 0) {
    return (
      <NoDataFound
        isCenter
        withImage
        text="No videos found"
      />
    )
  }

  return (
    <>
      {
      isSuccess ? (
        <>
          <div className="grid gap-x-4 lg:grid-cols-4 md:gap-y-4 gap-y-2 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
            {videos.pages.map(page => 
              page.map(video => {
                return (
                  <VideoCard key={`${video.id}`} video={video.videos} />
                )
              })
            )}
          </div>
          
          <div className='loadMore flex items-center justify-center mt-10'>
            <div className='loadMoreButton'>
              <div ref={ref} onClick={fetchNextPage} disabled={!hasNextPage || isFetchingNextPage} className='btn'>
                {isFetchingNextPage
                    ? <Loader2 />
                    : hasNextPage
                    ? 'Load More'
                    : null}
              </div>
            </div>
          </div>
        </>
      )
      : (
        <div><TimelineShimmer cols={28} /></div>
      )
    }
    </>
  )
 
}

export default WatchedVideos