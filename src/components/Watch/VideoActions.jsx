import { useRef, useState } from 'react'
import { FiFlag } from 'react-icons/fi'
import { RiShareForwardLine } from 'react-icons/ri'
import ShareModal from '../Common/ShareModal'
import { Button } from '../UI/Button'
import Reactions from './Reactions'
import { BsThreeDots } from 'react-icons/bs'
import DropMenu from '../UI/DropMenu'
import usePersistStore from '@store/persist'
import { APP } from '@utils/constants'
import useAppStore from '@store/app'

const VideoActions = ({ video }) => {
    const {isLoggedIn, user } = usePersistStore()
    const [showShare, setShowShare] = useState(false)
    const reporterID = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check;
    const selectedChannel = useAppStore((state) => state.selectedChannel)
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
                            <a
                                href={`https://desoreporting.aidaform.com/content?ReporterPublicKey=${reporterID}&PostHash=${video?.posthash}&ReportedAccountPublicKey=${video?.ProfileEntryResponse?.PublicKeyBase58Check}&ReportedAccountUsername=${video?.ProfileEntryResponse?.Username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-2 space-x-3 hover-primary"
                            >
                                <FiFlag size={18} className="ml-0.5" />
                                <span className="whitespace-nowrap">Report</span>
                            </a>
                        </div>
                    </div>
                </DropMenu>
            </div>     
        </>
    )
}

export default VideoActions