import { getTimeFromSeconds } from "@utils/functions"

const ThumbnailOverlays = ({ video, duration }) => {
  return (
    <>
        <div>
        {video?.is_live ?
          <span className="py-0.5 absolute bottom-3 right-2 text-sm px-1 text-white bg-red-600 rounded">
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

