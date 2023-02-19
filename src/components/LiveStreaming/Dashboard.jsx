import useAppStore from '@store/app'
import { APP } from '@utils/constants'
import { NextSeo } from 'next-seo'
import { Fragment } from 'react'
import { BiCopy, BiX } from 'react-icons/bi'
import Video from './Video'
import { BsCheck } from 'react-icons/bs'
import { Combobox, Transition } from '@headlessui/react'
import { HiChevronUpDown } from "react-icons/hi2";
import Category from '../Upload/Category'
import { Button } from '../UI/Button'
import { useRouter } from 'next/router'
import { CREATOR_VIDEO_CATEGORIES } from '@app/data/categories'


function LiveDashboard({ onUpload, onCancel }) {
    const router = useRouter()
    const setLiveStream = useAppStore((state) => state.setLiveStream)
    const liveStream = useAppStore((state) => state.liveStream)

    return (
        <>
            <NextSeo
                title='Create Live Stream'
                canonical={`${APP.URL}${router.asPath}`}
                openGraph={{
                    title: 'Create Live Stream',
                    url: `${APP.URL}${router.asPath}`,
                }}
            />
            <div className='md:px-16 px-4 max-w-7xl mx-auto mt-5'>
                <h3 className='mb-5 text-2xl font-bold'>Live Stream Details</h3>
                <div className="grid h-full gap-5 md:grid-cols-2">
                    <div className="flex flex-col rounded-lg p-5 bg-secondary justify-between">
                        <div>
                            <div className='mb-1'>
                                <label className='font-medium text-sm'>Title: </label>
                                <span className='text-sm'>{liveStream?.title}</span>
                            </div>
                            <div className='mb-1'>
                                <label className='font-medium text-sm'>Description: </label>
                                <span className='text-sm'>{liveStream?.description}</span>
                            </div>
                            <div className='mb-4'>
                                <label className='font-medium text-sm'>Category: </label>
                                <span className='text-sm'>{
                                    liveStream?.videoCategory.name
                                }
                                </span>
                            </div>
                            <div className='mb-4'>
                                <label className='font-medium text-sm'>Stream URL</label>
                                <input
                                    readOnly
                                    className='w-full bg-primary border theme-border rounded-md dark:text-white focus-visible:ring-0 text-black border-none py-2.5 pl-3 pr-10 text-sm leading-5 focus:ring-0'
                                    type="text"
                                    placeholder="Stream URL"
                                    value='rtmp://rtmp.livepeer.com/live'
                                />
                                <BiCopy className='absolute right-3 top-3 text-gray-500' />
                            </div>
                            <div className='mb-4 flex flex-col space-y-2'>
                                <label className='font-medium text-sm'>Stream Key</label>
                                <input
                                    readOnly
                                    className='w-full bg-primary border theme-border rounded-md dark:text-white focus-visible:ring-0 text-black border-none py-2.5 pl-3 pr-10 text-sm leading-5 focus:ring-0'
                                    type="text"
                                    placeholder="Stream Key"
                                    value={liveStream?.stream.streamKey}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-between">
                        <Video isDashboard={true} />
                    </div>
                </div>
                <div className="flex relative z-0 items-center space-x-4 justify-start mt-5">
                    <Button
                        onClick={() => {
                            setLiveStream({readyToPost: true, loading: true, dashButton: 'Creating Post'})
                        }}
                    >
                        {liveStream.dashButton}
                    </Button>
                    <Button
                        variant="light"
                        disabled={liveStream.loading}
                        onClick={() => onCancel()}
                        type="button"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </>
    )
}

export default LiveDashboard