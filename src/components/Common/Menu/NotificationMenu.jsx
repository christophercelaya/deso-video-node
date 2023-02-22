import Notification from '@components/Notifications/Notification'
import { Loader } from '@components/UI/Loader'
import DropMenu from '@components/UI/DropMenu'
import usePersistStore from '@store/persist'
import Deso from 'deso-protocol'
import React, { useEffect, useState } from 'react'
import { CgBell } from 'react-icons/cg'

const deso = new Deso();

function NotificationMenu() {
    const {isLoggedIn, user} = usePersistStore()
    const [notifications, setNotifications] = useState(null)
    const [notificationsList, setNotificationsList] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get notifications count after few seconds
        setTimeout(() => {
            getNotificationsCount()
        }, 1500)
        getNotifications()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const userPublicKey = isLoggedIn
        ? user.profile.PublicKeyBase58Check
        : "BC1YLhBLE1834FBJbQ9JU23JbPanNYMkUsdpJZrFVqNGsCe7YadYiUg";

    const getNotificationsCount = async () => {
        try {
            const request = {
                "PublicKeyBase58Check": userPublicKey
            };
            const response = await deso.notification.getUnreadNotificationsCount(request);
            setNotifications(response)
        } catch (error) {
            console.log(error)
        }
    }

    const getNotifications = async () => {
        try {
            const count = await deso.notification.getUnreadNotificationsCount({"PublicKeyBase58Check": userPublicKey});
            const request = {
                "PublicKeyBase58Check": userPublicKey,
                "FetchStartIndex": count ? count.LastUnreadNotificationIndex : 0,
                "NumToFetch": 15
            };
            const response = await deso.notification.getNotifications(request);
            //console.log(response);
            setLoading(false)
            setNotificationsList(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <DropMenu
                trigger={
                    <button className="text-secondary hover-primary flex items-center justify-center w-10 h-10 rounded-full flex-none mr-2 relative">
                        <CgBell size={24} />
                        {notifications?.NotificationsCount > 0 && (
                            <span className="absolute flex w-2 h-2 bg-red-500 rounded-full top-1 right-1" />
                        )}
                    </button>
                }
            >
                <div className="py-2 my-1 md:-mr-0 -mr-9 mt-1.5 w-80 md:w-96 max-h-96 divide-y focus-visible:outline-none focus:outline-none focus:ring-0 dropdown-shadow theme-divider overflow-hidden border theme-border rounded-xl bg-dropdown">
                    <div className="flex flex-col space-y-1 text-sm transition duration-150 ease-in-out rounded-lg">
                        <div className="inline-flex items-center justify-between p-2 pt-1 pb-3 space-x-2 rounded-lg">
                            <span className="text-base truncate leading-4">Notifications</span>
                        </div>
                    </div>
                    <div className='overflow-hidden overflow-y-scroll max-h-96 h-full'>
                        <div className='divide-y theme-divider flex flex-col space-y-2 pb-2'>
                            {loading ?
                                <div className='flex flex-col pt-2 items-center justify-center px-4'>
                                    <Loader className='w-5 h-5' />
                                </div>
                                : notificationsList && notificationsList.Notifications.map((notification, index) => (
                                <Notification key={index} ProfilesByPublicKey={notificationsList.ProfilesByPublicKey} reader={userPublicKey} PostsByHash={notificationsList.PostsByHash} notification={notification} />
                            ))}
                        </div>      
                    </div>
                </div>
            </DropMenu>
        </>
    )
}

export default NotificationMenu