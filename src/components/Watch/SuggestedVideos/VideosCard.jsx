/* eslint-disable @next/next/no-img-element */
import IsVerified from '@components/Common/IsVerified'
import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import ThumbnailOverlays from '../../Common/ThumbnailOverlays'
import VideoOptions from '../../Common/Cards/Options'
import Tooltip from '../../UI/Tooltip'
import { getProfilePicture } from '@utils/functions/getProfilePicture'
import { isBrowser } from 'react-device-detect'
import { getProfileName } from '@utils/functions/getProfileName'
import ShareModal from '@components/Common/ShareModal'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const SuggestedVideoCard = ({ video, channel }) => {
    const [showShare, setShowShare] = useState(false)
    const [showReport, setShowReport] = useState(false)
    console.log(video);
    return (
        <>
            {!video?.Post?.IsHidden ?  (
                <>
                    <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
                    <div className="flex w-full justify-between group" data-id={video?.id} data-duration={video?.duration}>
                        <div className="flex md:flex-row flex-col w-full">
                            <div className="flex-none overflow-hidden rounded-none md:rounded-xl w-full md:w-44">
                                <Link
                                    href={`/watch/${video?.id}`}
                                    className="rounded-xl cursor-pointer"
                                >
                                    <div className="relative">
                                        <LazyLoadImage
                                            delayTime={1000}
                                            className={clsx(
                                            'bg-gray-100 rounded-none md:rounded-xl dark:bg-gray-900 object-cover object-center h-52 md:h-24 w-full'
                                            )}
                                            alt={`Video by @${video?.ProfileEntryResponse.Username}`}
                                            wrapperClassName='w-full'
                                            effect="blur"
                                            placeholderSrc='https://placekitten.com/144/80'
                                            src={video?.thumbnail}
                                        />
                                        <ThumbnailOverlays video={video} duration={video?.duration} />
                                    </div>
                                </Link>
                            </div>
                            <div className="px-3 py-3 md:py-0 md:px-2.5 flex flex-row justify-between w-full">
                                <div className='flex space-x-2.5 md:space-x-0'>
                                    <div className="md:hidden flex flex-col">
                                        <Link href={`/@${video?.ProfileEntryResponse.Username}`} className="mt-0.5">
                                            <img
                                            className="w-9 h-9 rounded-full"
                                            src={getProfilePicture(video?.ProfileEntryResponse)}
                                            alt={`${video?.ProfileEntryResponse.Username} Picture`}
                                            draggable={false}
                                            />
                                        </Link>
                                    </div>
                                    <div className="flex md:space-y-1 space-y-0 flex-col md:w-auto items-start">
                                        <div className="break-words w-full md:mb-0 overflow-hidden">
                                            <Link
                                                href={`/watch/${video?.id}`}
                                                className="text-sm font-medium line-clamp-1"
                                            >
                                                <span className="flex line-clamp-2">
                                                    {video?.title}
                                                </span>
                                            </Link>
                                        </div>
                                        <div className='flex md:space-y-1 space-y-0 flex-col items-start'>
                                            <div className="truncate">
                                                <Link
                                                    href={`/@${video?.ProfileEntryResponse.Username}`}
                                                    className="text-sm truncate text-light"
                                                >
                                                    <div className="flex items-center space-x-1.5">
                                                        {isBrowser ? <Tooltip placement='top' contentClass='text-[12px]' title={getProfileName(video?.ProfileEntryResponse)}><span>{getProfileName(video?.ProfileEntryResponse)}</span></Tooltip> : <span>{video?.ProfileEntryResponse.Username}</span>}
                                                        {video?.ProfileEntryResponse.IsVerified ? <Tooltip placement='top' contentClass='text-[12px]' title='Verified'><span><IsVerified size="xs" /></span></Tooltip> : null}
                                                    </div>
                                                </Link>
                                            </div>
                                            <div>
                                                <div className="flex truncate items-center text-xs text-light">
                                                    {/* <span className="whitespace-nowrap">
                                                        {video?.views.length > 1 ? `${video?.views.length} views` : `${video?.views.length} view`}
                                                    </span> */}
                                                    {/* <span className="middot" /> */}
                                                    <span className="whitespace-nowrap">
                                                        {video?.AssociationsCount?.LIKE + video?.Post?.LikeCount} {(video?.AssociationsCount?.LIKE + video?.Post?.LikeCount) > 1 ? `likes` : `like`}
                                                    </span>
                                                    <span className="middot" />
                                                    <span>{dayjs(new Date(video.created_at))?.fromNow()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <VideoOptions
                                    setShowReport={setShowReport}
                                    video={video}
                                    isSuggested={true}
                                    setShowShare={setShowShare}
                                />
                            </div>
                        </div>
                    </div>
                </>
            ): null}
        </>
    )
}

export default SuggestedVideoCard