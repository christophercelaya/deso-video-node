/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ThumbnailOverlays from '../ThumbnailOverlays'
import IsVerified from '../IsVerified'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import VideoOptions from './Options'
import { getProfilePicture } from '@utils/functions/getProfilePicture'
import ShareModal from '../Modals/ShareModal'
import Tooltip from '@components/UI/Tooltip'
import { isBrowser } from 'react-device-detect'
import { getProfileName } from '@utils/functions/getProfileName'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getPost, getPostAssociations, getUserProfile } from '@app/data/videos'
import { APP } from '@app/utils/constants'
import usePersistStore from '@app/store/persist'
import { VideoCardInfoShimmer } from '@app/components/Shimmers/VideoCardShimmer'
import sanitizeIPFSURL from '@app/utils/functions/sanitizeIPFSURL'

dayjs.extend(relativeTime)


const VideoCard = ({ video }) => {
  const { isLoggedIn, user } = usePersistStore();
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [post, setPost] = useState(null)
  const [AssociationsCount, setAssociationsCount] = useState(null)
  const reader = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check;

  useEffect(() => {
    if (video?.posthash) {
      getCurrentPost(video?.posthash, reader);
      //getCurrentPostAssociations(video?.posthash, reader);
    }
    if (video?.user_id) {
      getCurrentUserProfile(video?.user_id, reader);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video])

  const getCurrentPost = async (posthash, reader) => {
    const response = await getPost(posthash, reader)
    setPost(response)
  }

  const getCurrentPostAssociations = async (posthash, reader) => {
    const response = await getPostAssociations(posthash, reader)
    setAssociationsCount(response)
  }

  const getCurrentUserProfile = async (user_id) => {
    const response = await getUserProfile(user_id)
    setUserProfile(response)
  }

  return (
    <>
      <div className="group">
        <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
        <Link href={`/watch/${video.id}`}>
          <div className="relative rounded-none md:rounded-xl aspect-w-16 overflow-hidden aspect-h-9">
              <LazyLoadImage
                delayTime={1000}
                className={clsx(
                'object-center bg-gray-100 dark:bg-gray-900 w-full h-full rounded-none md:rounded-xl lg:w-full lg:h-full object-cover'
                )}
                alt={video?.title}
                wrapperClassName='w-full'
                effect="blur"
                placeholderSrc='/default.jpg'
                src={sanitizeIPFSURL(video?.thumbnail)}
            />
            <ThumbnailOverlays video={video} duration={video?.duration} />
          </div>
        </Link>
        <div className="p-2">
          {userProfile && post ? (
            <div className="flex items-start space-x-2.5">
              <Link href={`/@${userProfile?.Username}`} className="flex-none mt-0.5">
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
                      href={`/watch/${video.id}`}
                      className="text-[15px] font-medium line-clamp-2 break-words"
                      >
                        {video?.title}
                    </Link>
                    <Link
                      href={`/@${userProfile?.Username}`}
                      className="flex w-fit items-center space-x-0.5 text-[14px] text-light"
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
                        {video?.views.length > 1 ? `${video?.views.length} views` : `${video?.views.length} view`}
                      </span>
                      <span className="middot" /> */}
                      <span className="whitespace-nowrap">
                        {post?.LikeCount} {post?.LikeCount > 1 ? `likes` : `like`}
                      </span>
                      <span className="middot" />
                        <span className="whitespace-nowrap">
                          {dayjs(new Date(video.created_at))?.fromNow()}
                        </span>
                    </div>
                  </div>
                  <VideoOptions
                    video={video}
                    userProfile={userProfile}    
                    post={post}
                    setShowShare={setShowShare}
                    setShowReport={setShowReport}
                  />
                </div>
              </div>
            </div>
          ) : 
            <VideoCardInfoShimmer/>
          }
        </div>
      </div>
    </>
  )
}

export default VideoCard