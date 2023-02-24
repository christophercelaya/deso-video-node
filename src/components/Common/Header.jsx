import { HOME } from '@utils/paths'
import Link from 'next/link'
import { Search } from '@components/Search'
import { APP } from '@utils/constants'
import Image from 'next/image'
import ThemeSwitch from './ThemeSwitch'
import usePersistStore from '@store/persist'
import { NotificationMenu, NewVideoMenu, UserMenu } from './Menu'




const Header = () => {
  const isLoggedIn = usePersistStore((state) => state.isLoggedIn)
  return (
    <>
      <div className='fixed items-center flex justify-start md:justify-between flex-row z-30 left-0 right-0 top-0 flex-shrink-0 bg-white dark:bg-[#0f0f0f] h-16 px-4'>
        <div className="md:w-56 flex md:flex-none flex-1 md:justify-center py-4">
          <Link
            href={HOME}
            className="flex items-center justify-start pb-1 focus:outline-none"
          >
            <Image src='/videso.svg' alt={APP.Name} height={35} width={35} />
            <span className='font-semibold font-oswald text-gray-700 dark:text-white text-2xl md:text-3xl ml-2'>
              {APP.Name}
            </span>
          </Link>
        </div>
        <Search />
        <div className="flex mr-[2px] flex-row items-center justify-end md:w-56">
          {
            isLoggedIn ? (
              <>
                <NewVideoMenu />
                {/* <NotificationMenu/> */}
              </>
            ) : <div className='mr-1'><ThemeSwitch /></div>
          } 
          <UserMenu/>
        </div>
      </div>
    </>
  )
}

export default Header