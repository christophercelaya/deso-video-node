import useAppStore from '@store/app'
import usePersistStore from '@store/persist'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Deso from 'deso-protocol'
import Form from './Form'
import toast from 'react-hot-toast'
import { useCreateStream } from '@livepeer/react';
import { SERVER_URL } from '@utils/constants'
import axios from 'axios'
import LiveDashboard from './Dashboard'

const deso = new Deso();

function LiveStreaming() {
    const {isLoggedIn, user} = usePersistStore()
    const liveStream = useAppStore((state) => state.liveStream)
    const setLiveStream = useAppStore((state) => state.setLiveStream)
    const setResetLiveStream = useAppStore((state) => state.setResetLiveStream)
    const router = useRouter();
    const [newPostHash, setNewPostHash] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const { mutate: createStream, data: stream, status, progress, error } = useCreateStream({ name: liveStream.title, record: true });

    useEffect(() => {
        if (newPostHash !== null) {
            saveToDB()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[newPostHash])

    useEffect(() => {
        status === 'success' ?
            setLiveStream({ buttonText: 'Go Live', loading: false, percent: 0, readyToPost: false, playbackId: stream?.playbackId, asset_id: stream?.id, stream: stream })
            : status === 'error'
                ? toast.error('Failed to Create Stream.')
                : status === 'loading'
                    ? setLiveStream({ buttonText: 'Creating Stream...', loading: true, percentText: 'Creating', percent: 0 })
                    : setLiveStream({ buttonText: 'Create Stream', loading: false, percent: 0, readyToPost: false });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    useEffect(() => {
        if (status === 'loading' || !stream?.isActive) {
            setLoading(true);
        } else {
            setLoading(false);
        }
        if (stream) {
            const videoURL = `https://livepeer-vod.studio/hls/${stream?.playbackId}/video`
            setLiveStream({ videoURL: videoURL, playbackId: stream?.playbackId, asset_id: stream?.id, loading: false, readyToLive: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, stream])

    console.log(liveStream)


    useEffect(() => {
        if (liveStream.readyToPost) {
           post();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [liveStream])

    const onCancel = () => {
        setResetLiveStream()
    }

    const post = async () => {
        try {
            const body = `${liveStream.description} \n ${liveStream.tags.map(tag => `#${tag}`)} \n\n Posted on @Videso`
            const extraData = {
                Title: liveStream.title,
                Tags: liveStream.tags,
                Category: liveStream.videoCategory.tag,
                Language: liveStream.language,
                Thumbnail: liveStream.thumbnail,
                isSensitiveContent: liveStream.isSensitiveContent,
                isNSFW: liveStream.isNSFW,
                isNSFWThumbnail: liveStream.isNSFWThumbnail,
                videoData: liveStream.videoData,
                videoURL: liveStream.videoURL,
                playbackId: liveStream.playbackId,
                isLivePeer: true,
                isLiveStream: true,
                Duration: liveStream.durationInSeconds
            }
            const payload = {
                UpdaterPublicKeyBase58Check: user.profile.PublicKeyBase58Check,
                BodyObj: {
                    Body: body,
                    ImageURLs: [],
                    VideoURLs: [`https://lvpr.tv/?v=${liveStream.playbackId}&autoplay=false`],
                },
                PostExtraData: {
                    Videso: JSON.stringify(extraData),
                }
            }
            const result = await deso.posts.submitPost(payload);
            if (result && result.submittedTransactionResponse.PostEntryResponse.PostHashHex) {
                const newPost = result.submittedTransactionResponse.PostEntryResponse.PostHashHex
                setNewPostHash(newPost)
            }
        } catch (error) {
            console.log(error)
            toast.error(`Error: ${error.message}`);
        }
    }
    
    const saveToDB = async () => {
        try {
            const request = {
                title: liveStream.title,
                description: liveStream.description,
                category: liveStream.videoCategory.tag,
                tags: JSON.stringify(liveStream.tags),
                user_id: user.profile.PublicKeyBase58Check,
                posthash: newPostHash,
                language: liveStream.language,
                thumbnail: liveStream.thumbnail,
                isSensitiveContent: liveStream.isSensitiveContent,
                isNSFW: liveStream.isNSFW,
                isNSFWThumbnail: liveStream.isNSFWThumbnail,
                playbackId: liveStream.playbackId,
                isLivePeer: true,
                is_live: true,
                asset_id: liveStream.asset_id,
                duration: liveStream.durationInSeconds
            }
            const {data} = await axios.post(`${SERVER_URL}/create-video`, request) 
            if (data?.data?.id) {
                toast.success('Congratulations! Post Created.');
                setResetLiveStream()
                setTimeout(() => {
                    router.push(`/@${user.profile.Username}`)
                }, 500)
            }
        } catch (error) {
            console.log('video upload', error.message); 
        }
    }

    const checkFieldsData = () => {
        if (liveStream.title !== '' || liveStream.description !== '') {
            return true;
        } 
        return false
    }

    const onUpload = () => {
        if (!checkFieldsData()) {
            return toast.error('All fields required!')
        }
        createStream();
    }

    return liveStream && liveStream?.readyToLive ? <LiveDashboard/> : <Form onCancel={onCancel} onUpload={onUpload} />
}

export default LiveStreaming