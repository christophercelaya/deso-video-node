
import { dateFormat, timeNow } from '@utils/functions'
import { FiClock, FiRepeat } from 'react-icons/fi'
import { IoDiamondOutline } from 'react-icons/io5'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const VideoMeta = ({ video }) => {

    return (
        <div className="flex flex-wrap items-center text-sm opacity-80">
            <div className="flex items-center">
                {/* <span className='flex items-center space-x-1 outline-none'>
                    <IoDiamondOutline size={15} />
                    <span>{video?.Post?.DiamondCount}</span>
                </span>
                <span className="px-1 middot" /> */}
                <span className='flex items-center space-x-1 outline-none'>
                    <FiRepeat size={14} />
                    <span>{video?.Post?.RepostCount + video?.Post?.QuoteRepostCount}</span>
                </span>
            </div>
            <span className="px-1 middot" />
            <span className="flex items-center space-x-1 outline-none" title={dateFormat(video.created_at)}>
                <FiClock size={16} />
                <span>{dayjs(new Date(video.created_at))?.fromNow()}</span>
            </span>
        </div>
    )
}

export default VideoMeta