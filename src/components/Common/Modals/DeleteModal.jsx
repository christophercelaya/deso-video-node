import Modal from '@components/UI/Modal'
import toast from 'react-hot-toast'
import Deso from 'deso-protocol';
import { useState } from 'react';
import { Button } from '@app/components/UI/Button';

const DeleteModal = ({ rootRef, show, setShowDeleteModal, video }) => {

    const [loading, setLoading] = useState(false)

    const hideVideo = async () => {
        const deso = new Deso()
        setLoading(true)
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
                setLoading(false)
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
        <Modal
            title="Delete Video"
            onClose={() => setShowDeleteModal(false)}
            show={show}
            ref={rootRef}
            panelClassName="w-full max-w-lg"
        >
            <div className="w-full px-5 flex flex-col space-y-6">
                <div className='text-center'>
                    <h3 className='font-bold text-lg mb-3'>Are you sure you want to delete this video?</h3>
                    <p>If you ask for deletion your post will be hide from the Deso.</p>
                </div>
                <div className='flex items-center space-x-3 justify-center'>
                    <Button
                        variant='dark'
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='light'
                        onClick={() => hideVideo()}
                        loading={loading}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteModal