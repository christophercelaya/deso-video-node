import { updateVideo } from "@app/data/video";
import { useAsset } from "@livepeer/react";
import { getTimeFromSeconds } from "@utils/functions"
import Deso from "deso-protocol";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ThumbnailOverlays = ({ video, duration }) => {
  const { data: asset } = useAsset(video?.asset_id);
  const isProcessing = asset ? asset.status.phase === 'processing' : false
  const isReady = asset ? asset.status.phase === 'ready' : false
  const isFailed = asset ? asset.status.phase === 'failed' : false
  const progress = asset ? asset.status.progress : 0
  const [readyToPost, setReadyToPost] = useState(false)

  useEffect(() => {
    if (isReady) {
      setReadyToPost(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isReady && video?.posthash === null && video?.is_processed === false) {
      post();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const post = async () => {
    const deso = new Deso();
    try {
      const body = `${video?.description} \n ${JSON.parse(video?.tags).length > 0 ? JSON.parse(video?.tags).map(tag => `#${tag}`) : ``} \n\n Posted on @Videso`
      const extraData = {
        Title: video.title,
        Tags: video.tags,
        Category: video.category,
        Language: video.language,
        Thumbnail: video.thumbnail,
        isSensitiveContent: video.isSensitiveContent,
        isNSFW: video.isNSFW,
        isNSFWThumbnail: video.isNSFWThumbnail,
        videoData: video.videoData,
        videoURL: video.videoURL,
        playbackId: video.playbackId,
        isLivePeer: true,
        Duration: video.duration,
        isLive: video.is_live,
      }
      const payload = {
        UpdaterPublicKeyBase58Check: video?.user_id,
        BodyObj: {
          Body: body,
          ImageURLs: [],
          VideoURLs: [`https://lvpr.tv/?v=${video.playbackId}&autoplay=false`],
        },
        PostExtraData: {
          Videso: JSON.stringify(extraData),
        }
      }
      const result = await deso.posts.submitPost(payload);
      if (result && result.submittedTransactionResponse.PostEntryResponse.PostHashHex) {
        const newPost = result.submittedTransactionResponse.PostEntryResponse.PostHashHex
        const res = await updateVideo({id: video?.id, user_id: video?.user_id, posthash: newPost, is_processed: true })
        if (res) {
          window.location.reload()
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(`Error: ${error.message}`);
    }
  }
  

  return (
    <>
      <div>
        {isProcessing ? (
          <span className="py-0.5 absolute animate-pulse top-3 left-2 text-xs px-1 text-white bg-red-600 rounded">
            {!isFailed ? `Processing ${Math.round(progress * 100)}%` : `Processing Failed`}
          </span>
        ) : null}
        {video?.is_live ?
          <span className="py-0.5 absolute bottom-3 right-2 text-xs px-2 text-white bg-red-600 rounded">
            Live
          </span>
          : duration ? (
            <span className="py-0.5 absolute bottom-3 right-2 text-xs px-1 text-white bg-black rounded">
              {getTimeFromSeconds(duration)}
            </span>
          ) : null}
        </div>
    </>
  )
}

export default ThumbnailOverlays

