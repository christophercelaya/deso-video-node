import useAppStore from '@store/app'
import { APP } from '@utils/constants'
import { NextSeo } from 'next-seo'
import { Fragment, useEffect, useRef, useState } from 'react'
import { BiX } from 'react-icons/bi'
import { Button } from '../UI/Button'
import InputMentions from '../UI/InputMentions'
import Category from './Category'
import UploadVideo from './Video'
import { BsCheck, BsEmojiSmile, BsFillEmojiSmileFill } from 'react-icons/bs'
import { Combobox, Transition } from '@headlessui/react'
import { LANGUAGES } from '@app/data/languages'
import { HiChevronUpDown } from "react-icons/hi2";
import { Switch } from '@headlessui/react'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'
import useOutsideClick from '@utils/hooks/useOutsideClick'


function UploadForm({onUpload, onCancel}) {
    const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
    const uploadedVideo = useAppStore((state) => state.uploadedVideo)
    const [tags, setTags] = useState([])
    const [currentTag, setCurrentTag] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [language, setLanguage] = useState(LANGUAGES[0])
    const [query, setQuery] = useState('')
    const [isSensitiveContent, setSensitiveContent] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [postEmoji, setEmoji] = useState(null)
    const emojiRef = useRef(null)
    useOutsideClick(emojiRef, () => { setShowEmojiPicker(false) })    
    useEffect(() => {
        if (postEmoji && postEmoji.emoji.trim().length > 0) {
            setUploadedVideo({ description: uploadedVideo.description + postEmoji.emoji })
            setDescription(uploadedVideo.description + postEmoji.emoji)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postEmoji])

    useEffect(() => {
        setUploadedVideo({ language: language })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language])
    
    useEffect(() => {
        setUploadedVideo({ isSensitiveContent: isSensitiveContent })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSensitiveContent])



    const filteredLanguage =
    query === ''
      ? LANGUAGES
      : LANGUAGES.filter((lang) =>
          lang
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

    const handleTags = (e) => {
        if (e.target.value !== "" && e.key === "Enter") {
            let tag = e.target.value
            setCurrentTag('');
            setTags([...tags, tag]); 
            setUploadedVideo({tags: [...tags, tag]})
        } else {
            setCurrentTag(e.target.value);
        }
    };
    
    return (
        <>
            <NextSeo
                title='Upload Videos'
                canonical={`${APP.URL}/upload`}
                openGraph={{
                    title: 'Upload Videos',
                    url: `${APP.URL}/upload`,
                }}
            />
            <div className='md:px-16 px-4 max-w-7xl mx-auto mt-5'>
                <h3 className='mb-4 text-2xl font-bold'>Upload videos</h3>
                <div className='flex w-full mb-5'>
                    <div className='py-3 text-center text-sm font-medium rounded-md'>
                        This Video will be auto post on DeSo blockchain after Processing and will be available on DeSo nodes.
                    </div>
                </div>
                <div className="grid h-full gap-5 md:grid-cols-2">
                    <div className="flex flex-col rounded-lg p-5 bg-secondary justify-between">
                        <div>
                            <div className='mb-4'>
                                <InputMentions
                                    label="Title"
                                    placeholder="Title that describes your video"
                                    autoComplete="off"
                                    value={title}
                                    required
                                    onFocus={() => null}
                                    onContentChange={(value) => {
                                        setTitle(value)
                                        setUploadedVideo({title: value})
                                    }}
                                    autoFocus
                                    mentionsSelector="input-mentions-single"
                                />
                            </div>
                            <div className='mb-4 flex flex-col space-y-2 relative'>
                                <InputMentions
                                    label="Description"
                                    placeholder="Tell viewers about your video (type @ to mention a channel) or add #Hashtags"
                                    autoComplete="off"
                                    required
                                    value={description}
                                    onFocus={() => null}
                                    onContentChange={(value) => {
                                        setDescription(value)
                                        setUploadedVideo({description: value})
                                    }}
                                    mentionsSelector="input-mentions-textarea"
                                />
                                <div
                                    ref={emojiRef}
                                    className='mt-2 relative inline-flex'
                                >
                                    {showEmojiPicker ?
                                        <BsFillEmojiSmileFill
                                            onClick={() => setShowEmojiPicker(false)}
                                            className='text-brand-500 cursor-pointer relative'
                                            size={19}
                                        /> :
                                        <BsEmojiSmile
                                            onClick={() => setShowEmojiPicker(true)}
                                            size={19}
                                            className='cursor-pointer relative'
                                        />
                                    }
                                    {showEmojiPicker && (
                                        <div className='absolute top-10 left-0 z-20' >
                                            <EmojiPicker
                                                emojiStyle={EmojiStyle.TWITTER}
                                                onEmojiClick={setEmoji}
                                                lazyLoadEmojis={true}
                                                previewConfig={{
                                                    showPreview: false
                                                }}
                                            />
                                        </div>   
                                    )}
                                </div>
                            </div>
                            <div className="mb-4 ">
                                <Category />
                            </div>
                            
                            <div className='mb-4 flex flex-col space-y-2'>
                                <label className='font-medium text-sm'>Language</label>
                                <div>
                                    <Combobox value={language} onChange={setLanguage}>
                                        <div className="relative mt-1">
                                            <div className="relative w-full cursor-default overflow-hidden bg-primary border theme-border rounded-md text-left focus:outline-none focus-visible:ring-0 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-300 sm:text-sm">
                                                <Combobox.Input
                                                    className="w-full bg-primary border theme-border rounded-md dark:text-white focus-visible:ring-0 text-black border-none py-2.5 pl-3 pr-10 text-sm leading-5 focus:ring-0"
                                                    displayValue={(language) => language}
                                                    onChange={(event) => setQuery(event.target.value)}
                                                />
                                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <HiChevronUpDown
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </Combobox.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                                afterLeave={() => setQuery('')}
                                            >
                                                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md dropdown-shadow bg-dropdown py-1 text-base focus:outline-none sm:text-sm">
                                                    {filteredLanguage.length === 0 && query !== '' ? (
                                                        <div className="relative cursor-default select-none py-2 px-4 text-light">
                                                            Nothing found.
                                                        </div>
                                                    ) : (
                                                        filteredLanguage.map((lang) => (
                                                            <Combobox.Option
                                                                key={lang}
                                                                className={({ active }) =>
                                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                    active ? 'bg-gray-100 dark:bg-gray-800' : 'dark:text-white text-gray-900'
                                                                }`
                                                                }
                                                                value={lang}
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span
                                                                        className={`block truncate ${
                                                                            selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                        >
                                                                            {lang}
                                                                        </span>
                                                                        {selected ? (
                                                                            <span
                                                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                                                active ? 'text-white' : 'text-brand-600 dark:text-white'
                                                                                }`}
                                                                            >
                                                                                <BsCheck className="h-5 w-5" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Combobox.Option>
                                                        ))
                                                    )}
                                                </Combobox.Options>
                                            </Transition>
                                        </div>
                                    </Combobox>
                                </div>
                            </div>
                            <div className='mb-4 flex flex-col space-y-2'>
                                <label className='font-medium text-sm'>Tags</label>
                                <input
                                    type='text'
                                    value={currentTag}
                                    onChange={handleTags}
                                    onKeyDown={handleTags}
                                    placeholder='Add Tags'
                                    className="w-full text-sm py-2.5 px-3 bg-primary border theme-border rounded-md focus:outline-none"
                                />
                                
                                <div className='flex my-2 w-3/4 flex-auto flex-wrap'>
                                    {tags.map((word, index) => (
                                    <div
                                        className='bg-primary hover-primary rounded-full text-sm pr-2 px-3 py-1 mx-1 my-1 flex items-center'
                                        key={index}>
                                        <p>{word}</p>
                                        <button
                                        className=' text-red-500 hover:text-red-700'
                                        onClick={() => {
                                                setTags(tags.filter((w) => w !== word))
                                                setUploadedVideo({tags: tags.filter((w) => w !== word)})
                                            }
                                        }
                                        >
                                        {" "}
                                        <BiX size={17} />
                                        </button>
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex flex-col space-y-2'>
                                <label className='font-medium text-sm'>Does this video contain sensitive information that targets an adult audience?</label>
                                <Switch
                                    checked={isSensitiveContent}
                                    onChange={setSensitiveContent}
                                    className={`${
                                        isSensitiveContent ? 'bg-gradient-to-r from-brand-500 to-pink-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                    <span
                                        className={`${
                                        isSensitiveContent ? 'translate-x-6 from-white to-white' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-gradient-to-r from-brand-500 to-pink-600 transition`}
                                    />
                                </Switch>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-between">
                        <UploadVideo />
                    </div>
                </div>
                {uploadedVideo.isNSFWThumbnail ? (
                    <div className='mt-5 bg-red-500 text-sm text-center text-white rounded-xl p-4'>
                        <span>
                            Sorry! <b className="px-0.5">Selected thumbnail</b> image has
                            some content warnings. It contains NSFW content, choose
                            different thumbnail.
                        </span>
                    </div>
                ) : uploadedVideo.isNSFW ? (
                    <div className='mt-5 bg-red-500 text-sm text-center text-white rounded-xl p-4'>
                        <span>
                            Sorry! This <b className="px-0.5">Video</b> has some content
                            warnings. It contains NSFW content in some frames, and so you can&apos;t post this Video!
                        </span>
                    </div>
                ) : (
                    <div className="flex relative z-0 items-center space-x-4 justify-start mt-5">
                        <Button
                            loading={uploadedVideo.loading || uploadedVideo.uploadingThumbnail}
                            disabled={uploadedVideo.loading || uploadedVideo.uploadingThumbnail || !uploadedVideo.thumbnail}
                            onClick={() => onUpload()}
                        >
                            {uploadedVideo.uploadingThumbnail
                                ? 'Uploading thumbnail'
                                : uploadedVideo.buttonText}
                        </Button>
                        <Button
                            variant="light"
                            disabled={uploadedVideo.loading || uploadedVideo.uploadingThumbnail}
                            onClick={() => onCancel()}
                            type="button"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                
            </div>
        </>
    )
}

export default UploadForm