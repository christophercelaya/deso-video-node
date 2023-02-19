import Link from "next/link";


export const Notify = ({ notification }) => {
    if(!notification) return null;
    return (
        <>
            {
                notification.type === 'REPLIED_TO_POST' ?
                    <span className='text-sm extralight flex-none flex space-x-1'>
                        <span>replied on your</span> <span>Video</span>
                    </span>
                    : notification.type === 'DIAMOND_SENT' ?
                        <span className='text-sm extralight flex-none flex space-x-1'>
                            <span>diamonded your</span> <span>Video</span>
                        </span>
                        : notification.type === 'LIKED' ?
                            <span className='text-sm extralight flex-none flex space-x-1'>
                                <span>liked your</span> <span>Video</span>
                            </span>
                            : notification.type === 'MENTIONED' ?
                                <span className='text-sm extralight flex-none flex space-x-1'>
                                    <span>mentioned you in</span> <span>Video</span>
                                </span>
                            : notification.type === 'FOLLOWED' ?
                                <span className='text-sm extralight flex-none flex space-x-1'>
                                    <span>followed you</span>
                                </span>
                            : notification.type === 'REPOSTED' ?
                                <span className='text-sm extralight flex-none flex space-x-1'>
                                    <span>reposted your</span> <span>Video</span>
                                </span>
                                : null
            }
        </>
    )
}

export default Notify