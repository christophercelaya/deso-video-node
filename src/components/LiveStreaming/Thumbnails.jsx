/* eslint-disable @next/next/no-img-element */
import ThumbnailsShimmer from '@components/Shimmers/ThumbnailsShimmer'
import { Loader } from '@components/UI/Loader'
import clsx from 'clsx'
import { BiImageAdd } from 'react-icons/bi'
import useAppStore from '@store/app'
import { useState } from 'react'
import Deso from 'deso-protocol';
import { UploadImage } from '@data/image'
import usePersistStore from '@store/persist'
import * as tf from '@tensorflow/tfjs'
import * as nsfwjs from 'nsfwjs'

const DEFAULT_THUMBNAIL_INDEX = 0
export const THUMBNAIL_GENERATE_COUNT = 0

const VideoThumbnails = ({ label, afterUpload }) => {
    const {user} = usePersistStore()
    const [thumbnails, setThumbnails] = useState([])
    const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0)
    const setLiveStream = useAppStore((state) => state.setLiveStream)
    const liveStream = useAppStore((state) => state.liveStream)

    const uploadThumbnail = async (file) => {
        setLiveStream({ uploadingThumbnail: true })
        const deso = new Deso();
        try {
            const request = undefined;  
            const jwt = await deso.identity.getJwt(request);
            const response = await UploadImage(jwt, file, user.profile.PublicKeyBase58Check)
            afterUpload(response.data.ImageURL, file.type || 'image/jpeg')
            return response.data.ImageURL
        } catch (error) {
            console.log(error)
        } finally {
            setLiveStream({ uploadingThumbnail: false })
        }
    }

    const checkNsfw = async (source) => {
        const img = document.createElement('img')
        img.src = source
        img.height = 200
        img.width = 400
        let predictions = []
        try {
            const model = await nsfwjs.load()
            predictions = await model?.classify(img, 3)
        } catch (error) {
            console.log('[Error Check NSFW]', error)
        }
        return getIsNSFW(predictions)
    }

    const handleUpload = async (e) => {
        if (e.target.files?.length) {
            setSelectedThumbnailIndex(0)
            const result = await uploadThumbnail(e.target.files[0])
            const preview = window.URL?.createObjectURL(e.target.files[0])
            const isNSFWThumbnail = await checkNsfw(preview)
            setLiveStream({ isNSFWThumbnail })
            setThumbnails([
                { url: preview, url: result, isNSFWThumbnail },
                ...thumbnails
            ])
            setSelectedThumbnailIndex(0)
        }
    }

    const onSelectThumbnail = async (index) => {
        setSelectedThumbnailIndex(index)
        setUploadedVideo({ isNSFWThumbnail: thumbnails[index]?.isNSFWThumbnail })
        afterUpload(thumbnails[index].image, 'image/jpeg')
    }

    return (
        <div className="w-full">
        {label && (
            <div className="flex items-center mb-1 space-x-1.5">
                <div className="font-medium text-sm">
                    {label}
                </div>
            </div>
        )}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 place-items-start py-0.5 gap-3">
            <label
                htmlFor="chooseThumbnail"
                className="flex flex-col items-center justify-center flex-none w-full h-20 border-2 border-dotted border-gray-300 cursor-pointer max-w-32 rounded-md opacity-80 focus:outline-none dark:border-gray-700"
            >
                <input 
                    id="chooseThumbnail"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    className="hidden w-full"
                    onChange={handleUpload}
                />
                    <BiImageAdd size={21} className="flex-none mb-1" />
                <span className="tracking-wide text-[13px]">Upload thumbnail</span>
            </label>
            {/* {!thumbnails.length && <ThumbnailsShimmer total='1' />} */}
                {thumbnails.map((thumbnail, idx) => {
                return (
                    <button
                        key={idx}
                        type="button"
                        disabled={
                            liveStream.uploadingThumbnail &&
                            selectedThumbnailIndex === idx
                        }
                        onClick={() => onSelectThumbnail(idx)}
                        className={clsx(
                            'rounded-md flex w-full relative cursor-grab flex-none focus:outline-none',
                            {
                            'drop-shadow-2xl ring ring-brand2-500': selectedThumbnailIndex === idx
                            }
                        )}
                    >
                        <img
                            className="object-cover w-full h-20 rounded-md"
                            src={thumbnail.url}
                            alt="thumbnail"
                            draggable={false}
                        />
                        {liveStream.uploadingThumbnail &&
                            selectedThumbnailIndex === idx && (
                            <div className="absolute top-1 right-1">
                                <span>
                                    <Loader size="sm" className="!text-white" />
                                </span>
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
        {!liveStream.thumbnail &&
        !liveStream.uploadingThumbnail ? (
            <p className="mt-2 text-xs font-medium text-red-500">
                Please choose a thumbnail
            </p>
        ) : null}
        </div>
    )
}

export default VideoThumbnails