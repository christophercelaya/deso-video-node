import clsx from 'clsx';
import { Suspense, useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import Custom404 from '@pages/500';
import { FetchProfile } from '@data/channel';
import ChannelShimmer from '@components/Shimmers/ChannelShimmer';
import { Loader2 } from '@components/UI/Loader';
import { NoDataFound } from '@components/UI/NoDataFound';
import ChannelInfo from './Info';
import axios from 'axios';
import toast from 'react-hot-toast';
import usePersistStore from '@store/persist';
import Deso from 'deso-protocol';
import { APP, DESO_CONFIG } from '@utils/constants';
import { BsThreeDots } from 'react-icons/bs';
import { Button } from '../UI/Button';
import MoreTabsModal from '../Common/Modals/MoreTabsModal';
import { getProfileName } from '@utils/functions/getProfileName';
import { NextSeo } from 'next-seo';

const ChannelVideos = dynamic(() => import("./Tabs/Videos"), {
  suspense: true,
});

const About = dynamic(() => import("./Tabs/About"), {
  suspense: true,
});

const Channel = () => {
    const router = useRouter();
    const { query } = router;
    const { isLoggedIn, user } = usePersistStore();
    const [channelStats, setChannelStats] = useState(false)
    const [isLoading, setisLoading] = useState(true)
    const [follow, setFollow] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedTab, setSelectedTab] = useState(0)
    const [followers, setFollowers] = useState(0)
    const [username, setUsername] = useState('')
    const [routeTab, setRouteTab] = useState('videos')
    const reader = isLoggedIn ? user.profile.PublicKeyBase58Check : '';
    const { data: channel, isError, error, isFetched } = FetchProfile(username);

    const channelTabs = {
        0: "Videos",
        // 1: "Stori",
        // 2: "Community",
        // 3: "Channels",
        1: "About",
    }

    const getDefaultTab = (tab) => {
        if (tab) {
            return Object.keys(channelTabs).find(key => channelTabs[key].toLowerCase() === tab.toLowerCase());
        }
        return 0;
    }

    useEffect(() => {
        if (query.channel) {
            setUsername(query.channel.replace('@', ""));
        }
        if (query.tab) {
            setRouteTab(query.tab)
            setSelectedTab(getDefaultTab(query.tab))
        } else {
            setRouteTab('videos')
            setSelectedTab(0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    useEffect(() => {
        if (isFetched && channel) {
            getFollowers()
            if (isLoggedIn) {
                checkFollowing()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetched, channel, isLoggedIn, reader])

    useEffect(() => {
        if (isFetched && channel) {
            FetchProfileStats(channel.Username);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetched, channel])

    
    const getFollowers = async() => {
        const deso = new Deso();
        try {
            const request = {
                PublicKeyBase58Check: channel.PublicKeyBase58Check,
                GetEntriesFollowingUsername: true
            };
            const response = await deso.social.getFollowsStateless(request);
            setFollowers(response.NumFollowers);
            setisLoading(false)
                
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        }
    }
    
    const checkFollowing = async() => {
        const deso = new Deso();
        const request = {
            PublicKeyBase58Check: reader,
            IsFollowingPublicKeyBase58Check: channel.PublicKeyBase58Check
        };
        try {
            const response = await deso.social.isFollowingPublicKey(request);
            if (response) {
                setFollow(response.IsFollowing);
                setisLoading(false)
            }

        } catch (error) {
            console.log(error);
            //toast.error("Something went wrong!");
        }
    }

    
    const FetchProfileStats = async (username) => {
        const requestURL = 'https://desocialworld.com/microservice-enriched/v1/get-single-profile';
        try {
            await axios.post(requestURL, {
                Username: username,
            }).then(response => {
                const UserAge = response.data.Profile.UserAge;
                const UserGeo = response.data.Profile.UserGeo;
                const UserLanguages = response.data.Profile.UserLanguages;
                setChannelStats({ UserAge, UserGeo, UserLanguages })
            });
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    }

    const changeTab = (index) => {
        setSelectedTab(index);
        const tab = channelTabs[index].toLowerCase()
        router.replace(`/@${username}/${tab}`);
    }

    if (isError) {
        return <NoDataFound 
            isCenter
            withImage
            title="Something went wrong"
            description="We are unable to fetch the latest videos. Please try again later."
          />
    } 

    if(isFetched && !channel) return <Custom404 />

    if (isLoading) return <ChannelShimmer />

    const Loader = () => {
        return (
            <div className="flex items-center mt-20 justify-center">
                <Loader2 />
            </div>
        )
    }

    const TabItem = ({ selected, index, title, isHidden = false }) => {
        const isSelected = selected === index ? true : false;
        return (
            <div
                className={
                    clsx(
                        'px-4 cursor-pointer md:px-8 py-3 flex items-center tracking-wider text-sm space-x-2 border-b-[3px] uppercase font-medium focus:outline-none',
                        isSelected
                        ? 'border-gray-700 dark:border-gray-500 font-semibold opacity-100'
                            : 'border-transparent hover:text-brand2-500 dark:hover:text-brand-500',
                        {
                            'md:block hidden': isHidden === true
                        }
                    )
                }
                onClick={() => changeTab(index)}
            >
                <span>{title}</span>
            </div>
        )
    }

    const TabButton = () => {
        return (
            <>
                <div className='md:hidden block'>
                    <Button
                        variant="none"
                        onClick={() => setShowModal(true)}
                        className='!p-0 w-10 h-10' 
                    >
                        <span className="flex items-center space-x-3">
                            <BsThreeDots size={26} />
                        </span>
                    </Button>
                </div>
            </>
        )
    }
    
    return (
        <>
            <NextSeo
                title={channel ? `${getProfileName(channel)} - ${APP.Name}` : APP.Name}
                canonical={`${APP.URL}${router.asPath}`}
                openGraph={{
                    title: channel ? `${getProfileName(channel)} - ${APP.Name}` : APP.Name,
                    url: `${APP.URL}${router.asPath}`,
                }}
            />
            {isFetched ?
                <div className="">
                    <ChannelInfo followers={followers} following={follow} channel={channel}/>
                    {channel && <MoreTabsModal username={channel.Username} show={showModal} setShowModal={setShowModal} />}
                    <div className="w-full">
                        <div className="border-b theme-border md:drop-shadow-none drop-shadow realtive mb-5">
                            <div className='flex md:justify-start max-w-7xl mx-auto'>
                                {channelTabs && Object.keys(channelTabs).map((key) => {
                                    if (key === '3' || key === '4') {
                                        return (
                                            <TabItem
                                                key={key}
                                                index={key}
                                                title={channelTabs[key]}
                                                selected={selectedTab}
                                                isHidden={true}
                                            />
                                        )   
                                    }
                                    return (
                                        <TabItem
                                            key={key}
                                            index={key}
                                            title={channelTabs[key]}
                                            selected={selectedTab}
                                        />
                                    )
                                })}
                                {/* <TabButton/> */}
                            </div>
                        </div>
                        <div className="md:py-3 p-0 md:px-16 focus:outline-none">
                            {routeTab === 'videos' && 
                                <Suspense fallback={<Loader />}>
                                    <ChannelVideos channel={channel} />
                                </Suspense>
                            }
                            {routeTab === 'about' &&
                                <Suspense fallback={<Loader/>}>
                                    <About stats={channelStats} channel={channel} />
                                </Suspense>
                            }
                        </div>
                    </div>
                </div>
        : <ChannelShimmer /> }
        </>
    )
}

export default Channel