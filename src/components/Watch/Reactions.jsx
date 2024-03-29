import useAppStore from '@store/app'
import usePersistStore from '@store/persist'
import { formatNumber } from '@utils/functions'
import { Button } from '@components/UI/Button'
import clsx from 'clsx'
import Deso from 'deso-protocol'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa'
import TipModal from '../Common/Modals/TipModal'
import { BiDollar } from 'react-icons/bi'
import { IoDiamondOutline } from 'react-icons/io5'
import DiamondModal from '../Common/Modals/DiamondsModal'
import party from "party-js"

const Reactions = ({ video, iconSize = '21', showTipButton = false, showDiamondButton = true, isComment = false, showButton = true}) => {
    const {isLoggedIn, user } = usePersistStore()
    const [liking, setLiking] = useState(false)
    const [liked, setLiked] = useState(isComment ? video?.PostEntryReaderState.LikedByReader : video?.Post?.PostEntryReaderState.LikedByReader)
    const [diamondBestowed, setDiamondBestowed] = useState(isComment ? video?.PostEntryReaderState.DiamondLevelBestowed : video?.Post?.PostEntryReaderState.DiamondLevelBestowed)
    const [diamonds, setDiamonds] = useState(isComment ? video?.DiamondCount : video?.Post?.DiamondCount)
    const [likes, setLikes] = useState(isComment ? video?.LikeCount : video?.Post?.LikeCount);
    const [showTip, setShowTip] = useState(false)
    const [showDiamond, setShowDiamond] = useState(false)
    const likeRef = useRef(null)


    const likeVideo = async (isLiked) => {
        if (!isLoggedIn) {
            return toast.error('You must be logged in!')
        } 
        const deso = new Deso();
        setLiking(true)
        const isUnlike = isLiked ? true : false;
        try {
            const request = {
                ReaderPublicKeyBase58Check: user.profile.PublicKeyBase58Check,
                LikedPostHashHex: isComment ? video?.PostHashHex: video.posthash,
                MinFeeRateNanosPerKB: 1000,
                IsUnlike: isUnlike,
            };
            const response = await deso.social.createLikeStateless(request);
            if (response && response.TxnHashHex !== null) {
                setLikes(!isUnlike ? likes + 1 : likes - 1);
                setLiked(!isUnlike);
                if (!isLiked) {
                    party.confetti(likeRef.current, {
                        count: party.variation.range(50, 100),
                        size: party.variation.range(0.2, 1.0),
                    });
                }
                setLiking(false)
            }
        } catch (error) {
            console.log('error', error)
            setLiking(false)
            toast.error(`Error: ${error.message}`);
        }
    }

    const showTipModal = () => {
        // if (!isLoggedIn) {
        //     return toast.error('You must be logged in!')
        // } 
        setShowTip(!showTip)
    }

    const showDiamondModal = () => {
        if (!isLoggedIn) {
            return toast.error('You must be logged in!')
        } 
        setShowDiamond(!showDiamond)
    }

    return (
        <>
            <TipModal show={showTip} setShowTip={setShowTip} video={video} />
            <DiamondModal setDiamonds={setDiamonds} diamonds={diamonds} diamondBestowed={diamondBestowed} setDiamondBestowed={setDiamondBestowed} show={showDiamond} setShowTip={setShowDiamond} video={video} />
            <div className='flex space-x-2 md:space-x-4'>
                <Button ref={likeRef} variant={showButton ? "light" : "none"} size={showButton ? 'md' : 'small'} className={`group ${showButton ? `h-10` : `!p-0`}`} onClick={() => { likeVideo(liked) }}>
                    <span className={clsx('flex items-center dark:group-hover:text-brand2-500 group-hover:text-brand2-500 space-x-2 outline-none', {
                        'text-brand2-500 dark:text-brand2-400 font-semibold': liked
                    },
                        { 'space-x-1.5 md:space-x-3': showButton },
                        { 'mt-1.5': !showButton }
                    )}>
                        {liked ? <FaThumbsUp size={iconSize}
                            className={clsx({
                                'text-brand2-500 dark:text-brand2-500': liked,
                                'animate-bounce': liking
                            })}
                        /> :
                            <FaRegThumbsUp size={iconSize}
                                className={clsx({
                                    'text-brand2-500 dark:text-brand2-500': liked,
                                    'animate-bounce': liking
                                })}
                            />
                        }

                        <span
                            className={clsx({
                                'text-brand2-500 dark:text-brand2-500': liked
                            })}
                        >
                            {likes > 0 ? formatNumber(likes) : '0'}
                        </span>
                    </span>
                </Button>
                
                {showDiamondButton ?
                    <Button variant={showButton ? "light" : "none"} size={showButton ? 'md' : 'small'} className={`group ${showButton ? `h-10` : `!p-0`}`} onClick={showDiamondModal}>
                        <span className={clsx('flex items-center group-hover:text-brand2-500 dark:group-hover:text-brand2-500 space-x-2 outline-none', {
                            'text-brand2-500 dark:text-brand2-500 font-semibold': diamondBestowed > 0
                        },
                            { 'space-x-1.5 md:space-x-3': showButton },
                            { 'mt-1.5': !showButton }
                        )}>
                            <IoDiamondOutline size={iconSize} />
                            <span>{formatNumber(diamonds)}</span>
                        </span>
                    </Button>
                :null }
                
                {showTipButton ?
                    <Button variant={showButton ? "light" : "none"} size={showButton ? 'md' : 'small'} className={`group ${showButton ? `h-10` : `!p-0`}`} onClick={showTipModal}>
                        <span className={clsx('flex items-center group-hover:text-brand2-500 dark:group-hover:text-brand2-500 space-x-2 outline-none',
                            { 'space-x-1.5 md:space-x-3': showButton },
                            { 'mt-1.5': !showButton }
                        )}>
                            <BiDollar size={18} />
                            <span>Tip</span>
                        </span>
                    </Button>
                    : null}
            </div>
        </>
    )
}

export default Reactions