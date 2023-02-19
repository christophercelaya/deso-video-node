/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { BsFillHeartFill, BsReplyFill } from 'react-icons/bs';
import { SlDiamond } from 'react-icons/sl';
import { FaRegUserCircle } from 'react-icons/fa';
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
            <div className='flex flex-col pt-2 px-4'>
                <div className='flex items-center space-x-1'>
                    {/* { notify.type === 'REPLIED_TO_POST' ?
                            <span className='text-sm extralight flex space-x-1 items-center'>
                                <BsReplyFill className='text-blue-500' size={17} />
                            </span>
                            : notify.type === 'DIAMOND_SENT' ?
                                <span className='text-sm extralight flex space-x-1 items-center'>
                                    <SlDiamond className='text-blue-700' size={17} />
                                </span>
                                : notify.type === 'LIKED' ?
                                    <span className='text-sm extralight flex space-x-1 items-center'>
                                        <BsFillHeartFill className='text-red-500' size={17} />
                                    </span>
                                    : notify.type === 'MENTIONED' ?
                                        <span className='text-sm extralight flex space-x-1 items-center'>
                                            <FaRegUserCircle className='text-blue-500' size={17} />
                                        </span>
                                        : null
                    } */}
                    <Link
                        href={`/@${notify.actor.Username}`}
                        className='cursor-pointer relative truncate max-w-1/2  flex items-center space-x-2 '>
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