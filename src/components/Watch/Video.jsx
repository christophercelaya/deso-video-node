import Linkify from 'linkify-react'
import "linkify-plugin-hashtag"
import "linkify-plugin-mention"
import { LinkifyOptions } from '@utils/functions/getLinkifyOptions'
import VideoActions from './VideoActions'
import ChannelInfo from './ChannelInfo'
import dynamic from 'next/dynamic'
import { CardShimmer } from '../Shimmers/VideoCardShimmer'
import { useRef } from 'react'

const VideoPlayer = dynamic(() => import('../Player/VideoPlayer'), {
  loading: () => <CardShimmer rounded={false} />,
  ssr: false
})

const Video = ({ video }) => {
  const userProfile = video.ProfileEntryResponse;
  const playerRef = useRef()
  return (
    <>
      <VideoPlayer
        video={video}
        playerRef={playerRef}
      />
      {/* <Player
        poster={video?.thumbnail}
        playbackId={video?.playbackId}
        aspectRatio='16to9'
        objectFit="contain"
        showPipButton={true}
        autoPlay={false}
        loop={true}
        showTitle={false}
        showUploadingIndicator={false}
      /> */}
      <div className="md:px-0 px-3 flex flex-col">
        <div>
            <h1 className="text-lg md:text-2xl font-medium line-clamp-2">
              <Linkify options={LinkifyOptions}>
                {video?.title}
              </Linkify>
            </h1>
        </div>
        <div className='flex md:flex-row flex-col justify-between md:items-center mt-3 flex-shrink-0'>
          <ChannelInfo channel={userProfile} video={video}/>
          <VideoActions video={video} />
        </div>
      </div>
    </>
  )
}

export default Video