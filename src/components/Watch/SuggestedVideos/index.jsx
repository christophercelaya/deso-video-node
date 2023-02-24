import AllVideos from './Tabs/AllVideos'

const SuggestedVideos = ({ video, currentVideoId }) => {

    return (
        <>
            <div className="pt-3 md:pt-0 pb-3">
                <div className="space-y-2 w-full md:w-auto flex flex-col">
                    <div className='space-y-1'>
                        <AllVideos video={video} currentVideoId={currentVideoId} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SuggestedVideos