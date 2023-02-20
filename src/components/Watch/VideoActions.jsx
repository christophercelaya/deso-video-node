import { useEffect, useRef, useState } from 'react'
import { FiFlag } from 'react-icons/fi'
import { RiShareForwardLine } from 'react-icons/ri'
import ShareModal from '../Common/Modals/ShareModal'
import { Button } from '../UI/Button'
import Reactions from './Reactions'
import { BsThreeDots } from 'react-icons/bs'
import DropMenu from '../UI/DropMenu'
import usePersistStore from '@store/persist'
import { APP } from '@utils/constants'
import useAppStore from '@store/app'
import { BiTrash } from 'react-icons/bi'
import Deso from 'deso-protocol'
import { addWatchLater, getWatchLater, removeWatchLater } from '@app/data/watchlater'
import WatchLater from '../Common/WatchLater'

const VideoActions = ({ video }) => {
    const {isLoggedIn, user } = usePersistStore()
    const [showShare, setShowShare] = useState(false)
    const [alreadyAddedToWatchLater, setAlreadyAddedToWatchLater] = useState(false)
    const reporterID = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check;
    const selectedChannel = useAppStore((state) => state.selectedChannel)
    const isVideoOwner = isLoggedIn ? user.profile.PublicKeyBase58Check === video?.ProfileEntryResponse?.PublicKeyBase58Check : false

    useEffect(() => {
        if (video) {
            isAlreadyAddedToWatchLater();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video])

    const isAlreadyAddedToWatchLater = async() => {
        const watchLater = await getWatchLater(reporterID, video?.id)
        if (watchLater) {
            setAlreadyAddedToWatchLater(true)
        }
    }

    const addToWatchLater = async() => {
        const { data } = await addWatchLater(reporterID, video?.id)
        if (data?.data.length > 0) {
            setAlreadyAddedToWatchLater(true)
        }
    }

    const removeFromWatchLater = async() => {
        const response = await removeWatchLater(reporterID, video?.id)
        if (response) {
            setAlreadyAddedToWatchLater(false)
        }
    }

    const onClickWatchLater = () => {
        alreadyAddedToWatchLater
        ? removeFromWatchLater()
        : addToWatchLater()
    }
    
    const deletVideo = async () => {
        const deso = new Deso()
        try {
            const payload = {
                PostHashHexToModify: video?.posthash,
                UpdaterPublicKeyBase58Check: user.profile.PublicKeyBase58Check,
                BodyObj: {
                    Body: video?.Post?.Body,
                    ImageURLs: video?.Post?.ImageURLs || [],
                    VideoURLs: video?.Post?.VideoURLs || [],
                },
                MinFeeRateNanosPerKB: 1000,
                InTutorial: false,
                PostExtraData: video?.Post?.PostExtraData,
                isHidden: true,
            }
            const result = await deso.posts.submitPost(payload);
            if (result && result.submittedTransactionResponse.PostEntryResponse.PostHashHex) {
                const response = await deleteVideoFromDB(video?.id, video?.user_id)
                if (response?.data.status === 204) {
                    window.location.reload();
                    toast.success('Video deleted successfully');
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(`Error: ${error.message}`);
        }
    }
    return (
        <>
            <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
            <div className="flex items-center md:justify-end mt-4 space-x-2 md:space-x-4 md:mt-0">
                <Reactions video={video} />
                <Button
                    variant="light"
                    onClick={() => setShowShare(true)}
                    className='h-10'
                >
                    <span className="flex items-center space-x-2 md:space-x-3">
                        <RiShareForwardLine size={22} />
                        <span>Share</span>
                    </span>
                </Button>
                <DropMenu
                    trigger={
                        <Button
                            variant="light"
                            className='md:!p-0 md:w-10 max-w-[40px] w-auto h-10' 
                        >
                            <span className="flex items-center space-x-2 md:space-x-3">
                                <BsThreeDots size={22} />
                            </span>
                        </Button>
                    }
                >
                    <div className="py-2 my-1 overflow-hidden rounded-lg dropdown-shadow bg-dropdown outline-none ring-0 focus:outline-none focus:ring-0 divide-y dropdown-shadow max-h-96 bg-dropdown theme-divider border theme-border w-56">
                        <div className="flex flex-col text-[14px] transition duration-150 ease-in-out rounded-lg">
                            {isLoggedIn ? <WatchLater onClickWatchLater={onClickWatchLater} alreadyAddedToWatchLater={alreadyAddedToWatchLater} /> : null}
                            <a
                                href={`https://desoreporting.aidaform.com/content?ReporterPublicKey=${reporterID}&PostHash=${video?.posthash}&ReportedAccountPublicKey=${video?.ProfileEntryResponse?.PublicKeyBase58Check}&ReportedAccountUsername=${video?.ProfileEntryResponse?.Username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-2 space-x-3 hover-primary"
                            >
                                <FiFlag size={18} className="ml-0.5" />
                                <span className="whitespace-nowrap">Report</span>
                            </a>
                            {isVideoOwner ?
                            <button
                                type="button"
                                onClick={deletVideo}
                                className="text-red-500 inline-flex items-center px-3 py-2 space-x-3 hover-primary"
                            >
                                <BiTrash size={22} />
                                <span className="whitespace-nowrap">Delete</span>
                            </button>
                            : null}
                        </div>
                    </div>
                </DropMenu>
            </div>     
        </>
    )
}

export default VideoActions