import VideoCard from '@components/Common/Cards/Video'
import { useInView } from 'react-intersection-observer'
import usePersistStore from '@store/persist';
import { NoDataFound } from '@components/UI/NoDataFound';
import TimelineShimmer from '@components/Shimmers/TimelineShimmer';
import { APP } from '@utils/constants';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { capitalizeText } from '@app/utils/functions';
import { FetchHashtagFeed } from '@app/data/hashtag';

function Hashtag() {
    const { ref, inView } = useInView()
    const router = useRouter()
    const user = usePersistStore((state) => state.user)
    const isLoggedIn = usePersistStore((state) => state.isLoggedIn)
    const hashtag = router?.query?.hashtag
    const reader = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check;
    const { isError, isFetched, data: videos } = FetchHashtagFeed(32, reader, hashtag);  

    if (isError) {
        return <NoDataFound 
            isCenter
            withImage
            title="Something went wrong"
            description="We are unable to fetch the latest videos. Please try again later."
        />
    }
    if (videos?.length === 0) {
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
            <NextSeo
                title={`Explore ${hashtag ? `- ${capitalizeText(hashtag)}` : ''}`}
                canonical={`${APP.URL}${router.asPath}`}
                openGraph={{
                    title: 'Explore',
                    url: `${APP.URL}${router.asPath}`,
                }}
            />
            {
                isFetched ? (
                    <>
                        <div className="grid gap-x-4 lg:grid-cols-4 md:gap-y-4 gap-y-2 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
                            {videos.map(video => {
                                return (
                                    <VideoCard userProfile={video.ProfileEntryResponse} key={`${video.id}`} video={video} />
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

export default Hashtag