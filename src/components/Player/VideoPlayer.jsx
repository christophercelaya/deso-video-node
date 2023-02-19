import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Player } from '@livepeer/react'
import useAppStore from '@store/app'
import { getCurrentDuration } from '@app/utils/functions/getCurrentDuration'
import usePersistStore from '@app/store/persist'
import { updateView } from '@app/data/video'

const PlayerInstance = ({ video, playerRef }) => {

  return (
    <>
      <Player
        mediaElementRef={playerRef}
        poster={video?.thumbnail}
        playbackId={video?.playbackId}
        aspectRatio='16to9'
        objectFit="contain"
        showPipButton={true}
        autoPlay={false}
        loop={true}
        showTitle={false}
        showUploadingIndicator={false}
      />
    </>
  )
}

const VideoPlayer = ({
  video,
  playerRef,
}) => {
  const videoWatchTime = useAppStore((state) => state.videoWatchTime)
  const currentDuration = getCurrentDuration(video?.duration);
  const [isStarted, setisStarted] = useState(false)
  const user = usePersistStore((state) => state.user)
  const isLoggedIn = usePersistStore((state) => state.isLoggedIn)
  const reader = isLoggedIn ? user.profile.PublicKeyBase58Check : APP.PublicKeyBase58Check

  const mediaElementRef = useCallback((ref) => {
    playerRef.current = ref
    playerRef.current.currentTime = Number(videoWatchTime || 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isStarted) return
    setNewView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarted])

  useEffect(() => {
    if (!playerRef.current) {
      return
    }
    playerRef.current.currentTime = Number(videoWatchTime || 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoWatchTime])

  useEffect(() => {

    if (!playerRef.current) {
      return
    }
    playerRef.current.addEventListener('timeupdate', onTimeUpdate)
    return () => {
      playerRef.current.removeEventListener('timeupdate', onTimeUpdate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerRef.current])

  const onTimeUpdate = () => {
    const seconds = Math.round(playerRef.current.currentTime)
    console.log(seconds, currentDuration)
    if (seconds === currentDuration) {
      setisStarted(true);
    }
  };

  const setNewView = async() => {
    const req = {
      posthash: video?.posthash,
      video_id: video?.id,
      channel: video.ProfileEntryResponse.Username,
      user_id: reader,
      lastwatched: new Date()
    }
    const response = await updateView(req);
    console.log(response)
  }

  const onContextClick = (event) => {
    event.preventDefault()
  }

  return (
    <div onContextMenu={onContextClick} className="relative">
      <PlayerInstance
        playerRef={mediaElementRef}
        video={video}
      />
    </div>
  )
}

export default React.memo(VideoPlayer)