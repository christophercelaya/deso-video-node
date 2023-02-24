import React from 'react'
import useVideoViews from '@app/data/views';

const VideoViews = ({video}) => {
    const { views } = useVideoViews(video?.playbackId);
    return (
        <>
            <span>{views > 1 ? `${views} views` : `${views} view`}</span>
        </>
    )
}

export default VideoViews