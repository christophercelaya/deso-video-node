import { LinkifyOptions } from '@utils/functions/getLinkifyOptions'
import Linkify from 'linkify-react'
import "linkify-plugin-hashtag"
import "linkify-plugin-mention"
import { useEffect, useState } from 'react'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import VideoMeta from './VideoMeta'
import VideoViews from './VideoViews'
import { CREATOR_VIDEO_CATEGORIES } from '@app/data/categories'
import Link from 'next/link'

const AboutChannel = ({video }) => {
  const channel = video.ProfileEntryResponse
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (video?.description.trim().length > 200) {
      setClamped(true)
      setShowMore(true)
    }
  }, [video])

  return (
    <div className="flex items-start justify-between w-full bg-secondary p-4 rounded-none md:rounded-xl">
      <div className="flex flex-col flex-1 overflow-hidden break-words">
        <div className='text-[14px] flex space-x-1 items-center font-medium mb-3'>
          {video ? <VideoViews video={video} /> : null}
          <span className='middot'></span>
          <VideoMeta video={video} />
        </div>
        {video?.description !== null && (
          <div className="text-sm md:text-sm">
          <Linkify options={LinkifyOptions}>
            {clamped ? video?.description.trim().substring(0, 200) : video?.description}
            </Linkify>
          </div>
        )}
        {showMore && (
          <div className="inline-flex mt-3">
            <button
              type="button"
              onClick={() => setClamped(!clamped)}
              className="flex items-center text-sm outline-none hover:opacity-100 opacity-80"
            >
              {clamped ? (
                <>
                  Show more <BiChevronDown size={20} className='-mt-[2px]' />
                </>
              ) : (
                <>
                  Show less <BiChevronUp size={20} className='-mt-[2px]' />
                </>
              )}
            </button>
          </div>
        )}
        <div className="flex mt-4">
          <div className="flex text-sm items-center space-x-2">
            <span>Category:</span>
            <Link
              href={`/explore/${video?.category}`}
              className="text-blue-500 hover:text-brand-500"
            >
              {
                CREATOR_VIDEO_CATEGORIES.find((category) => category.tag === video?.category)?.name
              }
            </Link>
          </div>
        </div>
        <div className="flex mt-4">
          <div className="flex text-sm items-center space-x-2">
            <span>Tags:</span>
            {JSON.parse(video?.tags)?.map((tag) => (
              <Link
                key={tag}
                href={`/hashtag/${tag.toLowerCase()}`}
                className="text-blue-500 hover:text-brand-500"
              >
                #{tag.toLowerCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutChannel