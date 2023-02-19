import useAppStore from '@store/app'
import usePersistStore from '@store/persist'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import DropZone from './DropZone'
import Deso from 'deso-protocol'
import UploadForm from './Form'
import toast from 'react-hot-toast'
import { useCreateAsset } from '@livepeer/react';
import { SERVER_URL } from '@utils/constants'
import axios from 'axios'

const deso = new Deso();

function Upload() {
    const {isLoggedIn, user} = usePersistStore()
    const uploadedVideo = useAppStore((state) => state.uploadedVideo)
    const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
    const setResetUploadedVideo = useAppStore((state) => state.setResetUploadedVideo)
    const router = useRouter();
    const [newPostHash, setNewPostHash] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const { mutate: createAsset, data: assets, status, progress, error } = useCreateAsset(
        // we use a `const` assertion here to provide better Typescript types
        // for the returned data
        uploadedVideo.file
        ? { sources: [{ name: uploadedVideo.file.name, file: uploadedVideo.file }], noWait: true, }
        : null,
    );

    useEffect(() => {
        if (newPostHash !== null) {
            saveToDB()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[newPostHash])

    useEffect(() => {
        progress?.[0].phase === 'failed'
            ? toast.error('Failed to upload video.')
            : progress?.[0].phase === 'waiting'
                ? setUploadedVideo({ buttonText: 'Waiting', percentText: 'Waiting', loading: true, percent: 0 })
                : progress?.[0].phase === 'uploading'
                    ? setUploadedVideo({ buttonText: 'Uploading Video...', loading: true, percentText: 'Uploading', percent: Math.round(progress?.[0]?.progress * 100) })
                    : progress?.[0].phase === 'processing'
                        ? setUploadedVideo({ buttonText: 'Processing Video...', loading: true, percentText: 'Processing', percent: Math.round(progress?.[0]?.progress * 100) })
                        : progress?.[0].phase === 'ready'
                            ? setUploadedVideo({ buttonText: 'Posting Video...', loading: true, readyToPost: true, percentText: 'Ready', percent: Math.round(progress?.[0]?.progress * 100) })
                            : setUploadedVideo({ buttonText: 'Submit Video', loading: false, percent: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress])

    useEffect(() => {
        if (status === 'loading' || (assets?.[0] && assets[0].status?.phase !== 'waiting')) {
            setLoading(true);
        } else {
            setLoading(false);
        }
        if (assets && assets[0] && assets[0].status?.phase === 'waiting') {
            const videoURL = `https://livepeer-vod.studio/hls/${assets[0]?.playbackId}/video`
            setUploadedVideo({ videoURL: videoURL, playbackId: assets[0]?.playbackId, asset_id: assets[0]?.id, loading: true, readyToPost: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, assets])

    console.log(uploadedVideo)


    useEffect(() => {
        if (uploadedVideo.readyToPost) {
           post();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedVideo])

    const onCancel = () => {
        setResetUploadedVideo()
    }

    const post = async () => {
        try {
            const body = `${uploadedVideo.description} \n ${uploadedVideo.tags.map(tag => `#${tag}`)} \n\n Posted on @Videso`
            const extraData = {
                Title: uploadedVideo.title,
                Tags: uploadedVideo.tags,
                Category: uploadedVideo.videoCategory.tag,
                Language: uploadedVideo.language,
                Thumbnail: uploadedVideo.thumbnail,
                isSensitiveContent: uploadedVideo.isSensitiveContent,
                isNSFW: uploadedVideo.isNSFW,
                isNSFWThumbnail: uploadedVideo.isNSFWThumbnail,
                videoData: uploadedVideo.videoData,
                videoURL: uploadedVideo.videoURL,
                playbackId: uploadedVideo.playbackId,
                isLivePeer: true,
                Duration: uploadedVideo.durationInSeconds
            }
            const payload = {
                UpdaterPublicKeyBase58Check: user.profile.PublicKeyBase58Check,
                BodyObj: {
                    Body: body,
                    ImageURLs: [],
                    VideoURLs: [`https://lvpr.tv/?v=${uploadedVideo.playbackId}&autoplay=false`],
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
                title: uploadedVideo.title,
                description: uploadedVideo.description,
                category: uploadedVideo.videoCategory.tag,
                tags: JSON.stringify(uploadedVideo.tags),
                user_id: user.profile.PublicKeyBase58Check,
                posthash: newPostHash,
                language: uploadedVideo.language,
                thumbnail: uploadedVideo.thumbnail,
                isSensitiveContent: uploadedVideo.isSensitiveContent,
                isNSFW: uploadedVideo.isNSFW,
                isNSFWThumbnail: uploadedVideo.isNSFWThumbnail,
                playbackId: uploadedVideo.playbackId,
                isLivePeer: true,
                asset_id: uploadedVideo.asset_id,
                duration: uploadedVideo.durationInSeconds
            }
            const {data} = await axios.post(`${SERVER_URL}/create-video`, request) 
            if (data?.data?.id) {
                toast.success('Congratulations! Post Created.');
                setResetUploadedVideo()
                setTimeout(() => {
                    router.push(`/@${user.profile.Username}`)
                }, 500)
            }
        } catch (error) {
            console.log('video upload', error.message); 
        }
    }

    const checkFieldsData = () => {
        if (uploadedVideo.title !== '' || uploadedVideo.description !== '') {
            return true;
        } 
        return false
    }

    const onUpload = () => {
        if (!checkFieldsData()) {
            return toast.error('All fields required!')
        }
        const file = uploadedVideo.file
        if (file.size > 1 * (1024 * 1024 * 1024)) {
            toast.error('File is too large. Please choose a file less than 1GB');
            return;
        }
        createAsset();
    }

    return uploadedVideo?.file ? <UploadForm onCancel={onCancel} onUpload={onUpload} /> : <DropZone />
}

export default Upload