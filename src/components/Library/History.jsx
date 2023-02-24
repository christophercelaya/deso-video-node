import TimelineShimmer from '@components/Shimmers/TimelineShimmer';
import usePersistStore from '@store/persist';
import { NoDataFound } from '@components/UI/NoDataFound';
import Carousel from "react-multi-carousel";
import VideoCardSmall from '../Common/Cards/SmallCard';
import { isBrowser } from 'react-device-detect';
import { FetchHistoryFeed } from '@app/data/history';


const History = () => {
    const user = usePersistStore((state) => state.user)
    const reader = user.profile.PublicKeyBase58Check
    const { isError, isSuccess, data: videos } = FetchHistoryFeed(32, reader);  

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2
        }
    };

    if (isError) {
        return <NoDataFound 
            isCenter
            withImage
            title="Something went wrong"
            description="We are unable to fetch the latest videos. Please try again later."
          />
    } 

    if (isSuccess && videos?.length === 0) {
        return <NoDataFound 
            isCenter
            withImage
            title="Something went wrong"
            text="Oops! No more videos."
        />
    }

    return (
        <>
            { isSuccess ? (
                <div className="grid gap-x-4 lg:grid-cols-4 md:gap-y-4 gap-y-2 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
                    {videos.length > 0 &&
                        isBrowser ?
                        <>
                            {videos.map((video) => {
                                return (
                                    <VideoCardSmall key={`${video.id}`} video={video.videos} />
                                )
                            })}
                        </>
                        : 
                        <Carousel
                            responsive={responsive}
                            swipeable={true}
                            draggable={true}
                            showDots={false}
                            infinite={false}
                        >
                            {videos.map((video) => {
                                    return (
                                        <VideoCardSmall key={`${video.id}`} video={video.videos} />
                                    )
                                })
                            }
                        </Carousel>
                    }
                </div>
            ) : (
                <div><TimelineShimmer cols={8} /></div>
            )}
        </>
    
    )
 
}

export default History