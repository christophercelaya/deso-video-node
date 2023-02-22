import DropMenu, { NextLink } from '@app/components/UI/DropMenu'
import { Menu } from '@headlessui/react'
import usePersistStore from '@store/persist'
import { EXPLORE, HOME, LIBRARY, UPLOAD } from '@utils/paths'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsCloudUpload } from 'react-icons/bs'
import { FiHome } from 'react-icons/fi'
import { MdOutlineVideoLibrary, MdSensors, MdShuffle } from 'react-icons/md'
import { RiVideoAddLine } from 'react-icons/ri'
import { TfiVideoCamera } from 'react-icons/tfi'

const MobileMenu = () => {
  const router = useRouter()
  const { isLoggedIn, user } = usePersistStore()

  const isActivePath = (path) => router.pathname === path

  return (
    <div className="fixed inset-x-0 bottom-0 dropdown-shadow z-10 md:hidden">
      <div
        className={clsx(
          'grid py-2 bg-dropdown space-between',
          {
            'grid-cols-4': isLoggedIn,
            'grid-cols-3' : !isLoggedIn,
          }
        )}
      >
        <Link
          href={HOME}
          className="flex flex-col space-y-1 items-center justify-center w-full"
        >
          <FiHome size={21} 
            className={clsx({
              'active-secondary': isActivePath(HOME)
            })}
          />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href={EXPLORE}
          className="flex flex-col space-y-1 items-center justify-center w-full"
        >
          <MdShuffle size={21}
            className={clsx({
              'active-secondary': isActivePath(EXPLORE)
            })}
          />
          <span className="text-xs">Explore</span>
        </Link>
        {isLoggedIn ? 
          <Link
            href={UPLOAD}
            className="flex flex-col space-y-1 items-center justify-center w-full"
          >
            <BsCloudUpload size={21}
              className={clsx({
                'active-secondary': isActivePath(UPLOAD)
              })}
            />
            <span className="text-xs">Upload</span>
          </Link>
        : null}
        <Link
          href={LIBRARY}
          className="flex flex-col space-y-1 items-center justify-center w-full"
        >
          <MdOutlineVideoLibrary size={21}
            className={clsx({
              'active-secondary': isActivePath(LIBRARY)
            })}
          />
          <span className="text-xs">Library</span>
        </Link>
      </div>
    </div>
  )
}

export default MobileMenu