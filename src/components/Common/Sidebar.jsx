import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiHome } from 'react-icons/fi'
import {
  MdOutlineVideoLibrary,
  MdHistory,
  MdShuffle,
} from 'react-icons/md'
import { HISTORY, HOME, LIBRARY, PRIVACY, ABOUT, EXPLORE } from '@utils/paths'
import { CREATOR_VIDEO_CATEGORIES } from '@data/categories'
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { IoDiamondOutline } from "react-icons/io5";
import { APP } from '@utils/constants'
import { useState } from 'react'
import { BsChevronDown, BsChevronUp, BsInfoSquare, BsShieldExclamation } from 'react-icons/bs'
import SimpleBar from 'simplebar-react';

const Sidebar = ({isSidebarCollapsed}) => {
  const router = useRouter()
  const [showMore, setShowMore] = useState(false)
  const loadCount = showMore ? CREATOR_VIDEO_CATEGORIES.length : 6;


  const isActivePath = (path) => router.pathname === path
  const isActiveCategory = (category) => router.query.category === category
  return (
    <>
      <div className={`flex flex-col w-64 p-4 primaryBg h-screen pr-0 items-start justify-start overflow-hidden z-10 pt-16 text-[14px] font-light tracking-wide`}>
        <SimpleBar forceVisible="y" style={{ height: `100%`, width: `100%` }}>
          <div className="flex flex-col w-full overflow-hidden pr-4">
            <div className="flex flex-col w-full space-y-1">
              <Link
                href={HOME}
                className={clsx(
                  'rounded-lg px-3 py-2 group hover-primary',
                  {
                    'active-primary font-bold ': isActivePath(HOME),
                  },
                  )}
                >
                <div className={`flex items-center`}>
                  <FiHome size={21} />
                   <p className={`flex ml-6`}>Home</p>
                </div>
              </Link>
              <Link
                href={LIBRARY}
                className={clsx(
                  'rounded-lg px-3 py-2 group hover-primary',
                  {
                    'active-primary font-bold ': isActivePath(LIBRARY),
                  },
                )}
              >
                <div className={`flex items-center`}>
                  <MdOutlineVideoLibrary size={21} />
                  <p className={`flex ml-6`}>Library</p>
                </div>
              </Link>
              <Link
                href={HISTORY}
                className={clsx(
                  'rounded-lg px-3 py-2 group hover-primary',
                  {
                    'active-primary font-bold ': isActivePath(HISTORY),
                  },
                )}
              >
                <div className={`flex items-center`}>
                  <MdHistory size={21} />
                  <p className={`flex ml-6`}>History</p>
                </div>
              </Link>
              <Link
                href={EXPLORE}
                className={clsx(
                  'rounded-lg px-3 py-2 group hover-primary',
                  {
                    'active-primary font-bold ': isActivePath(EXPLORE),
                  },
                )}
              >
                <div className={`flex items-center`}>
                  <MdShuffle size={20} />
                  <p className={`flex ml-6`}>Explore</p>
                </div>
              </Link>
            </div>
            <div className="h-[1px] mt-4 mb-6 relative theme-border-bg" />
            <div className="flex flex-col w-full mb-3 px-3">
              <div className='text-base font-medium'>Explore</div>
            </div>
            <div className="flex flex-col space-y-1">
              {Object.keys(CREATOR_VIDEO_CATEGORIES.slice(0, loadCount)).map((categories) => {
                if (categories !== 6) {
                  const category = CREATOR_VIDEO_CATEGORIES[categories];
                  return (
                    <Link key={category.tag.toLowerCase()}
                      href={`/explore/${category.tag.toLowerCase()}`}
                      className={clsx(
                        'rounded-lg px-3 py-2 group',
                        isActiveCategory(category.tag.toLowerCase())
                          ? 'active-primary font-bold'
                          : 'hover-primary'
                      )}
                    >
                      <div className="flex items-center">
                        {category.icon}
                        <p className='ml-6'>{category.name}</p>
                      </div>
                    </Link>
                  )
                }
              })}
              {
                !showMore ?
                  <div key={`showMore`} onClick={() => setShowMore(!showMore)} className="cursor-pointer rounded-lg px-3 py-2 group hover-primary">
                    <div className="flex items-center">
                      <BsChevronDown size={20} />
                      <p className='ml-6'>Show More</p>
                    </div>
                  </div>
                  :
                  <div key={`showMore`} onClick={() => setShowMore(!showMore)} className="cursor-pointer rounded-lg px-3 py-2 group hover-primary">
                    <div className="flex items-center">
                      <BsChevronUp size={20} />
                      <p className='ml-6'>Show Less</p>
                    </div>
                  </div>
              }
            </div>
            <div className="h-[1px] mt-4 mb-6 relative theme-border-bg" />
            <div className="flex flex-col space-y-1">
              <a
                href='https://twitter.com/VidesoApp' target='_blank' rel="noreferrer"
                className={'rounded-lg px-3 py-2 group hover-primary'}
              >
                <div className="flex items-center">
                  <FaTwitter size={21} />
                  <p className='ml-6'>Twitter</p>
                </div>
              </a>
              <a
                href='https://diamondapp.com/Videso' rel="noreferrer"
                className={'rounded-lg px-3 py-2 group hover-primary'}
              >
                <div className="flex items-center">
                  <IoDiamondOutline size={21} />
                  <p className='ml-6'>DiamondApp</p>
                </div>
              </a>
              <a
                href='https://discord.gg/8T5RUrsP6W' rel="noreferrer"
                className={'rounded-lg px-3 py-2 group hover-primary'}
              >
                <div className="flex items-center">
                  <FaDiscord size={21} />
                  <p className='ml-6'>Discord</p>
                </div>
              </a>
              <Link
                href={ABOUT}
                className={clsx(
                  'rounded-lg px-3 py-2 group hover-primary',
                  {
                    'active-primary font-bold ': isActivePath(ABOUT),
                  },
                  )}
              >
                <div className="flex items-center">
                  <BsInfoSquare size={21} />
                  <p className='ml-6'>About</p>
                </div>
              </Link>
              <Link
                href={PRIVACY}
                className={clsx(
                  'rounded-lg px-3 py-2 group hover-primary',
                  {
                    'active-primary font-bold ': isActivePath(PRIVACY),
                  },
                  )}
              >
                <div className="flex items-center">
                  <BsShieldExclamation size={21} />
                  <p className='ml-6'>Privacy</p>
                </div>
              </Link>
            </div>
            <div className="h-[1px] mt-4 mb-6 relative theme-border-bg" />
            <div className='flex w-full px-3 text-sm text-primary space-x-1'>
              <span>Powered by</span>
              <Link
                className="text-primary text-primary-hover text-sm font-medium"
                href='https://livepeer.org/'
                rel="noreferrer noopener"
                target="_blank"
              >
                <span>LivePeer</span>
              </Link>
            </div>
            <div className='flex flex-col px-3 text-sm text-primary mt-4'>
              <p>© 2022 {APP.Name}</p>
            </div>
          </div>
        </SimpleBar>
      </div>
    </>
  )
}

export default Sidebar