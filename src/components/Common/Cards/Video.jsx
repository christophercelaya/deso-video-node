/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Deso from 'deso-protocol'
import ThumbnailOverlays from '../ThumbnailOverlays'
import IsVerified from '../IsVerified'
import { getThumbDuration, timeNow } from '@utils/functions'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import VideoOptions from './Options'
import axios from 'axios'
import { getIsLivePeerUrl, getPlaybackIdFromUrl } from '@utils/functions/getVideoUrl'
import { getLivePeerVideoThumbnail, getVideoThumbnail } from '@utils/functions/getVideoThumbnail'
import { getProfilePicture } from '@utils/functions/getProfilePicture'
import { getVideoTitle } from '@utils/functions/getVideoTitle'
import ShareModal from '../ShareModal'
import { DESO_CONFIG } from '@utils/constants'
import Tooltip from '@components/UI/Tooltip'
import { isBrowser } from 'react-device-detect'
import { getProfileName } from '@utils/functions/getProfileName'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import useAppStore from '@store/app'
import { getLivePeerVideoStatus, getVideoStatus } from '@data/api'
import { getVideoExtraData } from '@app/utils/functions/getVideoExtraData'


const VideoCard = ({ video, userProfile }) => {
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const [videoData, setVideoData] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('/default-black.jpg')
  const extraData = getVideoExtraData(video);
  const supabase = useSupabaseClient()
  const [views, setViews] = useState(0)

  useEffect(() => {
    if (extraData && !extraData.isLivePeer) {
      getVideoData();
    }
    else if (!extraData) {
      getVideoData();
    } 
    getViews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video])

  const getVideoData = async () => {
    console.log('video', video)
    const videoID = getPlaybackIdFromUrl(video);
    const isLivePeerUrl = getIsLivePeerUrl(video);
    if (isLivePeerUrl) {
      try {
        //const data = await getLivePeerVideoStatus(videoID)
        const thumb = getLivePeerVideoThumbnail(videoID, 1);
        console.log(thumb);
        setVideoData({ id: videoID, isLiverPeer: true, thumbnail: thumb, data: extraData, hls: `https://lp-playback.com/hls/${videoID}/index.m3u8` })
      } catch (error) {
        console.error('livepeer thumbnail', error.message);
      }
    } else {
      try {
        const data = await getVideoStatus(videoID)
        const duration = getThumbDuration(data?.data?.Duration);
        const thumb = getVideoThumbnail(video, duration);
        setVideoData({ id: videoID, isLiverPeer: false, thumbnail: thumb.url, data: data?.data, hls: `https://customer-wgoygazehbn8yt5i.cloudflarestream.com/${videoID}/manifest/video.m3u8` })
      } catch (error) {
        console.error('old thumbnail', error.message);
      }
    }
  }

  // useEffect(() => {
  //   const getThumbnail = async () => {
  //       try {
  //         const duration = getThumbDuration(videoData.Duration);
  //         const thumb = getVideoThumbnail(video, duration);
  //         if (thumb.processed) {
  //           setThumbnailUrl(thumb.url)
  //         } else {
  //           try {
  //             await axios.get(thumb.url, { responseType: 'blob' }).then((res) => {
  //               setThumbnailUrl(URL.createObjectURL(res.data))
  //             })
  //           } catch (error) {
  //               //console.log(video.PostHashHex, error)
  //           }
  //         }
  //       } catch (error) {
  //         //console.log(video.PostHashHex, error)
  //     }
  //   }
  //   if (videoData) {
  //     getThumbnail()
  //   }
  //       // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [videoData])

  
  function getViews() {
    supabase.from('views').select('*', { count: 'exact' }).eq('posthash', video.PostHashHex).then((res) => {
        setViews(res.count)
        if (res.error) {
          console.log(video.PostHashHex, 'views', res.error);
        }
    })
  }

  return (
    <>
    {!video.IsHidden ? (
      <div className="group">
          <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
          <Link href={`/watch/${video.PostHashHex}`}>
            <div className="relative rounded-none md:rounded-xl aspect-w-16 overflow-hidden aspect-h-9">
                <LazyLoadImage
                  delayTime={1000}
                  className={clsx(
                  'object-center bg-gray-100 dark:bg-gray-900 w-full h-full rounded-none md:rounded-xl lg:w-full lg:h-full object-cover'
                  )}
                  alt={`Video by @${userProfile.Username}`}
                  wrapperClassName='w-full'
                  effect="blur"
                  placeholderSrc='https://placekitten.com/360/220'
                  src={videoData ? videoData.thumb : extraData?.Thumbnail}
              />
              <ThumbnailOverlays video={video} data={videoData ? videoData : extraData} />
            </div>
          </Link>
          <div className="p-2">
            <div className="flex items-start space-x-2.5">
              <Link href={`/@${userProfile.Username}`} className="flex-none mt-0.5">
                <img
                  className="w-9 h-9 rounded-full"
                  src={getProfilePicture(userProfile)}
                  alt={getProfileName(userProfile)}
                  draggable={false}
                />
              </Link>
              <div className="grid flex-1">
                <div className='flex w-full items-start justify-between '>
                  <div className="flex flex-col w-full items-start pr-2 justify-between min-w-0">
                    <Link
                      href={`/watch/${video.PostHashHex}`}
                      className="text-[15px] font-medium line-clamp-2 break-words"
                      >
                        {getVideoTitle(video, userProfile)}
                    </Link>
                    <Link
                      href={`/@${userProfile.Username}`}
                      className="flex w-fit items-center space-x-1.5 text-[14px] text-light"
                    >
                      {isBrowser ?
                        <Tooltip placement='top' contentClass='text-[12px]' title={getProfileName(userProfile)}>
                          <span>{getProfileName(userProfile)}</span>
                        </Tooltip>
                        :
                        <span>{getProfileName(userProfile)}</span>
                      }
                      {userProfile.IsVerified ?
                        <Tooltip placement='top' contentClass='text-[12px]' title='Verified'>
                          <span><IsVerified size="xs" /></span>
                        </Tooltip>
                        : null
                      }
                    </Link>
                    <div className="flex overflow-hidden text-[13px] text-light">
                      {/* <span className="whitespace-nowrap">
                        {views > 1 ? `${views} views` : `${views} view`}
                      </span>
                      <span className="middot" /> */}
                      <span className="whitespace-nowrap">
                        {video.LikeCount > 1 ? `${video.LikeCount} likes` : `${video.LikeCount} like`}
                      </span>
                      <span className="middot" />
                        <span className="whitespace-nowrap">
                          {timeNow(video.TimestampNanos)}
                        </span>
                    </div>
                  </div>
                  <VideoOptions
                    video={video}
                    setShowShare={setShowShare}
                    setShowReport={setShowReport}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        null
      )}
    </>
  )
}

export default VideoCard