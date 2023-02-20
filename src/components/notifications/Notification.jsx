/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Notify from './Notify';
import { parseNotification } from '@app/utils/functions/parseNotification';
import { EXTERNAL_LINK } from '@app/utils/constants';
import IsVerified from '../Common/IsVerified';
import Link from 'next/link';

function Notification({ ProfilesByPublicKey, reader, PostsByHash, notification }) {
    let profiles = {};
    let posts = {};
    Object.assign(profiles, ProfilesByPublicKey);
    Object.assign(posts, PostsByHash);
    const notify = parseNotification(notification, reader, profiles, posts)
    if (!notify) return null;

    return (
        <>
            <div className='flex flex-col pt-2 px-2 md:px-4'>
                <div className='flex items-center space-x-1'>
                    <Link
                        href={`/@${notify.actor.Username}`}
                        className='cursor-pointer relative truncate max-w-1/2 flex items-center space-x-2 '>
                        <img
                            src={`${EXTERNAL_LINK}/api/v0/get-single-profile-picture/${
                            notify.actor.PublicKeyBase58Check
                            }?fallback=https://diamondapp.com/assets/img/default_profile_pic.png`}
                            className='w-7 h-7 rounded-full'
                            alt={notify.actor.Username}
                        />
                        <div className='flex items-center space-x-0.5'>
                            <span className='text-sm'>{notify.actor.Username}</span>
                            {notify.actor.IsVerified ?
                            <span><IsVerified size="xs" /></span>
                            : null
                            }
                        </div>
                    </Link>
                    <Notify notification={notify} />
                </div>
            </div>
        </>
    )
}

export default Notification