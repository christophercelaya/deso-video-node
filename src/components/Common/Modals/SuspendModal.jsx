import Modal from '@components/UI/Modal'
import toast from 'react-hot-toast'
import Deso from 'deso-protocol';
import { useEffect, useState } from 'react';
import { Button } from '@app/components/UI/Button';
import { useUpdateStream } from '@livepeer/react';

const SuspendModal = ({ rootRef, show, set, stream, video, setSuspended }) => {

    const {
        mutate: updateStream,
        status,
        error,
    } = useUpdateStream({
        streamId: video?.asset_id,
        suspend: true,
    });

    useEffect(() => {
        if(status === 'success') {
            toast.success('Stream Suspended')
            set(false)
            setSuspended(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])
    
    return (
        <Modal
            title="Suspend Stream"
            onClose={() => set(false)}
            show={show}
            ref={rootRef}
            panelClassName="w-full max-w-lg"
        >
            <div className="w-full px-5 flex flex-col space-y-6">
                <div className='text-center'>
                    <h3 className='font-bold text-lg mb-3'>Are you sure you want to suspend this stream?</h3>
                    <p>Stream will be private for all, If you wanna stop streaming you have to stop from your Device.</p>
                </div>
                <div className='flex items-center space-x-3 justify-center'>
                    <Button
                        variant='dark'
                        onClick={() => set(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='light'
                        onClick={() => updateStream?.()}
                        loading={status === 'loading'}
                    >
                        Suspend
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default SuspendModal