import VideoCard from '@components/Common/Cards/Video'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer';
import { useInView } from 'react-intersection-observer'
import usePersistStore from '@store/persist';
import { NoDataFound } from '@components/UI/NoDataFound';
import { FetchHistoryFeed } from '@app/data/history';


const Timeline = () => {
    const { ref, inView } = useInView()
    const { isLoggedIn, user } = usePersistStore()
    const reader = user.profile.PublicKeyBase58Check;

    const { isError, isSuccess, data: videos } = FetchHistoryFeed(32, reader);
    
    console.log(videos)
    
    if (videos?.length === 0) {
        return (
            <NoDataFound
                isCenter
                withImage
                text="No videos found"
            />
        )
    }

    if (isError) {
        return <NoDataFound 
            isCenter
            withImage
            title="Something went wrong"
            text="We are unable to fetch the latest videos. Please try again later."
          />
    } 

    return (
        <>
            { isSuccess ? (
                <>
                    <div className="grid gap-x-4 lg:grid-cols-4 md:gap-y-4 gap-y-2 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
                        {videos.map(video => {
                            return (
                                <VideoCard key={`${video.id}`} video={video?.videos} />
                            )
                        })}
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

export default Timeline