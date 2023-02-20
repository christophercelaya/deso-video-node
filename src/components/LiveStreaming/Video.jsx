/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'
import useAppStore from '@store/app'
import toast from 'react-hot-toast'
import ProgressBar from '../UI/ProgressBar'
import VideoThumbnails from './Thumbnails'
import { Player } from '@livepeer/react'

function UploadVideo({isDashboard = false}) {
    const liveStream = useAppStore((state) => state.liveStream)
    const setLiveStream = useAppStore((state) => state.setLiveStream)
    const videoRef = useRef(null)

    const onThumbnailUpload = (ipfsUrl, thumbnailType) => {
        setLiveStream({ thumbnail: ipfsUrl, thumbnailType })
    }
    
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="overflow-hidden relative rounded-xl w-full">
                    <div className="overflow-hidden relative rounded-xl w-full">
                        {liveStream && liveStream?.readyToLive ? (
                            <Player
                                title={liveStream?.title}
                                poster={liveStream?.thumbnail}
                                playbackId={liveStream?.playbackId}
                                aspectRatio='16to9'
                                objectFit="contain"
                                showPipButton={true}
                                autoPlay={false}
                                loop={true}
                                showTitle={false}
                                showUploadingIndicator={false}
                            />
                        ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full aspect-w-16 aspect-h-9">
                                    <img src={liveStream?.thumbnail} alt='' className="w-full h-full object-cover" />
                                </div>
                        )}
                    </div>
                </div>
                
                {liveStream.percent !== 0 ?
                    <>
                        <ProgressBar progress={liveStream.percent} height={24} />
                    </>
                    : null
                }
                
                {!isDashboard ?
                    <div className={`${liveStream.percent === 0 ? `mt-4` : ``}`}>
                        <VideoThumbnails
                            label="Thumbnail"
                            afterUpload={(ipfsUrl, thumbnailType) => {
                                onThumbnailUpload(ipfsUrl, thumbnailType)
                            }}
                        />
                    </div>
                : null}
            </div>
        </>
    )
}

export default UploadVideo