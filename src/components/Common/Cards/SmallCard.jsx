/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
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

dayjs.extend(relativeTime)


const VideoCardSmall = ({ video, userProfile }) => {
    const [showShare, setShowShare] = useState(false)
    const [showReport, setShowReport] = useState(false)
    return (
        <>
            {!video?.Post?.IsHidden ?  (
                <div className="group px-2">
                    <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
                    <Link href={`/watch/${video?.id}`}>
                        <div className="relative rounded-lg aspect-w-16 overflow-hidden aspect-h-9">
                            <LazyLoadImage
                                delayTime={1000}
                                className={clsx(
                                'object-center bg-gray-100 dark:bg-gray-900 w-full h-full rounded-lg lg:w-full lg:h-full object-cover'
                                )}
                                alt={`Video by @${userProfile.Username}`}
                                wrapperClassName='w-full'
                                effect="blur"
                                placeholderSrc='/default.jpg'
                                src={video?.thumbnail}
                            />
                            <ThumbnailOverlays video={video} duration={video?.duration} />
                        </div>
                    </Link>
                    <div className="p-2">
                        <div className="flex items-start space-x-2.5">
                        {isBrowser ? <Link href={`/@${userProfile.Username}`} className="flex-none mt-0.5">
                            <img
                                className="w-9 h-9 rounded-full"
                                src={getProfilePicture(userProfile)}
                                alt={getProfileName(userProfile)}
                                draggable={false}
                            />
                        </Link> : null}
                            <div className="grid flex-1">
                                <div className='flex w-full items-start justify-between '>
                                    <div className="flex flex-col w-full items-start pr-2 justify-between min-w-0">
                                        <Link
                                            href={`/watch/${video?.id}`}
                                            className="text-[13px] font-medium line-clamp-2 break-words"
                                            >
                                            {video?.title}
                                        </Link>
                                        <Link
                                            href={`/@${userProfile.Username}`}
                                            className="flex w-fit items-center space-x-1.5 text-[14px] text-light"
                                        >
                                            {isBrowser ?
                                                <Tooltip placement='top' contentClass='text-[12px]' title={getProfileName(userProfile)}><span>{getProfileName(userProfile)}</span></Tooltip> :
                                                <span>{getProfileName(userProfile)}</span>
                                            }
                                            {userProfile.IsVerified ? <Tooltip placement='top' contentClass='text-[12px]' title='Verified'><span><IsVerified size="xs" /></span></Tooltip> : null}
                                        </Link>
                                        <div className="flex overflow-hidden text-[13px] text-light">
                                            {/* <span className="whitespace-nowrap">
                                            {views > 1 ? `${views} views` : `${views} view`}
                                            </span> */}
                                            {/* <span className="middot" /> */}
                                            <span className="whitespace-nowrap">
                                                {video?.AssociationsCount?.LIKE + video?.Post?.LikeCount} {(video?.AssociationsCount?.LIKE + video?.Post?.LikeCount) > 1 ? `likes` : `like`}
                                            </span>
                                            <span className="middot" />
                                            <span>{dayjs(new Date(video.created_at))?.fromNow()}</span>
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
            ): null}
        </>
    )
}

export default VideoCardSmall