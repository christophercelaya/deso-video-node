import usePersistStore from '@store/persist'
import { APP } from '@utils/constants'
import DropMenu from '@components/UI/DropMenu'
import clsx from 'clsx'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FiFlag } from 'react-icons/fi'
import { RiShareForwardLine } from 'react-icons/ri'
import WatchLater from '@components/Common/WatchLater'
import { useEffect, useState } from 'react'
import { addWatchLater, getWatchLater, removeWatchLater } from '@app/data/watchlater'
import { BiTrash } from 'react-icons/bi'
import DeleteModal from '../Modals/DeleteModal'

const VideoOptions = ({video, setShowShare, isSuggested = false, showOnHover = true, userProfile, post}) => {
  const { isLoggedIn, user } = usePersistStore();
  const reporterID = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check;
  const isVideoOwner = isLoggedIn ? user.profile.PublicKeyBase58Check === userProfile?.PublicKeyBase58Check : false
  const [alreadyAddedToWatchLater, setAlreadyAddedToWatchLater] = useState(false)
  const reader = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check;
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (video) {
      isAlreadyAddedToWatchLater();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video])

  const isAlreadyAddedToWatchLater = async() => {
    const watchLater = await getWatchLater(reader, video?.id)
    if (watchLater) {
      setAlreadyAddedToWatchLater(true)
    }
  }

  const addToWatchLater = async() => {
    const { data } = await addWatchLater(reader, video?.id)
    if (data?.data.length > 0) {
      setAlreadyAddedToWatchLater(true)
    }
  }

  const removeFromWatchLater = async() => {
    const response = await removeWatchLater(reader, video?.id)
    if (response) {
      setAlreadyAddedToWatchLater(false)
    }
  }

  const onClickWatchLater = () => {
    alreadyAddedToWatchLater
    ? removeFromWatchLater()
    : addToWatchLater()
  }

  return (
    <>
      <DeleteModal video={video} show={showDeleteModal} setShowDeleteModal={setShowDeleteModal} />
      <DropMenu
        trigger={
          <div
            className={clsx(
              'hover-primary rounded-full w-9 h-9 flex items-center justify-center md:text-inherit outline-none ring-0 group-hover:visible transition duration-150 ease-in-out md:-mr-4 focus:outline-none focus:ring-0',
              {
                'lg:invisible': showOnHover
              }
            )}
          >
            <BsThreeDotsVertical size={17} />
          </div>
        }
      >
        <div className="py-2 my-1 overflow-hidden rounded-lg dropdown-shadow bg-dropdown outline-none ring-0 focus:outline-none focus:ring-0 w-56">
          <div className="flex flex-col text-[14px] transition duration-150 ease-in-out rounded-lg">
            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="inline-flex items-center px-3 py-2 space-x-3 hover-primary"
            >
              <RiShareForwardLine size={22} />
              <span className="whitespace-nowrap">Share</span>
            </button>
            {isLoggedIn ? <WatchLater onClickWatchLater={onClickWatchLater} alreadyAddedToWatchLater={alreadyAddedToWatchLater} /> : null}
            <a
              href={`https://desoreporting.aidaform.com/content?ReporterPublicKey=${reporterID}&PostHash=${video.posthash}&ReportedAccountPublicKey=${userProfile?.PublicKeyBase58Check}&ReportedAccountUsername=${userProfile?.Username}`}
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
                onClick={() => setShowDeleteModal(true)}
                className="text-red-500 inline-flex items-center px-3 py-2 space-x-3 hover-primary"
              >
                <BiTrash size={22} />
                <span className="whitespace-nowrap">Delete</span>
              </button>
            : null}
          </div>
        </div>
      </DropMenu>
    </>
    
  )
}

export default VideoOptions