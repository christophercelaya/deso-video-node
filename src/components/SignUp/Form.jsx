import usePersistStore from '@app/store/persist';
import useCopyToClipboard from '@app/utils/hooks/useCopyToClipboard';
import Deso from 'deso-protocol';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react'
import { toast } from 'react-hot-toast';
import { Button } from '../UI/Button';
import { BiUpload } from 'react-icons/bi';
import { getBase64FromFile } from '@app/utils/functions';
import axios from 'axios';

const Form = () => {
    const { isLoggedIn, newUser, setLoggedIn, setIsNewUser, setNewUser, setUser } = usePersistStore();
    const router = useRouter()
    const rootRef = useRef(null)
    const [copy] = useCopyToClipboard()
    const [cover, setCover] = useState(null)
    const [newCover, setNewCover] = useState(null)
    const defaultCover = `/backgrounds/cover.jpg`;
    const [avatar, setAvatar] = useState(null)
    const [newAvatar, setNewAvatar] = useState(`/default_profile_pic.png`)
    const [loading, setLoading] = useState(false)
    const [uploadingCover, setUploadingCover] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [displayName, setDisplayName] = useState('')
    const [description, setDescription] = useState('')
    const [username, setUsername] = useState('')
    const [location, setLocation] = useState('')
    const [languages, setLanguages] = useState('')
    const [twitterLink, setTwitterLink] = useState('')
    const [instagramLink, setInstagramLink] = useState('')
    const [youtubeLink, setYoutubeLink] = useState('')
    const [linkedinLink, setLinkedInLink] = useState('')
    const [githubLink, setGithubLink] = useState('')
    const [discordLink, setDiscordLink] = useState('')
    const [websiteTitle, setWebsiteTitle] = useState('')
    const [websiteLink, setWebsiteLink] = useState('')
    const [customTitle, setCustomTitle] = useState('')
    const [customLink, setCustomLink] = useState('')
    const [checkingUsername, setCheckingUsername] = useState(false)
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)
    const [profileDescription, setProfileDescription] = useState("")
    const [base68Image, setBase64Image] = useState("");
    const fileInput = useRef(null);

    const handleCover = async () => {
        setUploadingCover(true);
        const deso = new Deso();
        try {
            const request = {
                UserPublicKeyBase58Check: newUser.profile.PublicKeyBase58Check
            };
            const response = await deso.media.uploadImage(request);
            setNewCover(response.ImageURL);
        } catch (error) {
            console.log(error)
        }
    }

    const handleUsernameChange = async (e) => {
        setUsername(e.target.value);
        setCheckingUsername(true);
        const deso = new Deso();
        //check if value is only alphanumeric including underscore
        let regex = /^[a-zA-Z0-9_]*$/;
        if (!regex.test(e.target.value)) {
            setIsUsernameAvailable(false);
            setCheckingUsername(false);
            return;
        }
        try {
            const request = {
                PublicKeyBase58Check: "",
                Username: e.target.value,
            };
            try {
                const userFound = await deso.user.getSingleProfile(request);

                if (userFound == null) {
                    setIsUsernameAvailable(true);
                } else {
                    setIsUsernameAvailable(false);
                }
            } catch (error) {
                setIsUsernameAvailable(true);
            }

            setCheckingUsername(false);
        } catch (error) {
        console.log(error);
            setCheckingUsername(false);
        }
    };

    const handleProfilePicUpload = async (e) => {
        setUploadingAvatar(true);

        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;
            if (
                fileType === "image/png" ||
                fileType === "image/webp" ||
                fileType === "image/jpg" ||
                fileType === "image/jpeg"
            ) {
                handleAvatar(file);
            }
        }
    };

    const handleAvatar = async (file) => {
        const request = undefined;
        const deso = new Deso();
        try {
            const jwt = await deso.identity.getJwt(request);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("JWT", jwt);
            formData.append(
                "UserPublicKeyBase58Check",
                newUser.profile.PublicKeyBase58Check
            );
            const {data} = await axios.post("https://node.deso.org/api/v0/upload-image",formData);
            if (data.ImageURL !== "") {
                setNewAvatar(data.ImageURL);
                const base64imgRes = await getBase64FromFile(file);
                setBase64Image(base64imgRes);
            }
            setUploadingAvatar(false);
        } catch (e) {
            setUploadingAvatar(false);
            console.log(e);
        }
    }

    const updateChannel = async () => {
        setLoading(true);
        const deso = new Deso();
        const payload = {
            ProfileImage: newAvatar,
            CoverImage: newCover,
            DisplayName: displayName,
            Description: profileDescription,
            Location: location,
            Languages: languages,
            TwitterURL: twitterLink,
            InstagramURL: instagramLink,
            YoutubeURL: youtubeLink,
            LinkedInURL: linkedinLink,
            GithubURL: githubLink,
            DiscordURL: discordLink,
            CustomTitle: customTitle,
            CustomURL: customLink,
            WebsiteTitle: websiteTitle,
            WebsiteURL: websiteLink,
        }
        const profileReq = {
            UpdaterPublicKeyBase58Check: newUser.profile.PublicKeyBase58Check,
            NewUsername: username,
            NewDescription: profileDescription,
            NewProfilePic: base68Image,
            ExtraData: {
                Videso: JSON.stringify(payload),
                FeaturedImageURL: newCover,
                LargeProfilePicURL: newAvatar,
            },
            NewStakeMultipleBasisPoints: 12500,
            MinFeeRateNanosPerKB: 1000,
            NewCreatorBasisPoints: 10000,
        }
        try {
            const response = await deso.social.updateProfile(profileReq);
            if (response && response.TransactionHex !== null) {
                const profile = await deso.user.getSingleProfile({PublicKeyBase58Check: newUser.profile.PublicKeyBase58Check});
                if (profile && profile.Profile !== undefined) {
                    setIsNewUser(false);
                    setNewUser([])
                    setLoggedIn(true);
                    setUser({ profile: profile.Profile });
                    toast.success("Channel Created!");
                    party.confetti(rootRef.current, {
                        count: party.variation.range(100, 2000),
                        size: party.variation.range(0.2, 1.5),
                    });
                    setTimeout(() => {
                        router.push(`/@${profile.Profile.Username}`);
                    }, 2000);
                    setLoading(false);
                } else {
                    toast.error("Something went wrong");
                }
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }


    return (
        <>
            <div ref={rootRef}>
                <div className='flex flex-col'>
                    <div className='flex rounded-md flex-col'>
                        <div
                            style={{
                                backgroundImage: `url(${newCover ? newCover : defaultCover})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                            }}
                            className=' w-full md:h-72 h-28 relative flex justify-center items-center dark:border-[#2D2D33] border-gray-100 border '>
                            <div className='flex w-full md:h-72 h-28 justify-end items-end pb-3 pr-3 relative group z-10'>
                                <div className='flex items-center space-x-3'>
                                    <Button onClick={handleCover} loading={uploadingCover} variant='light'>
                                        Change Cover
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='max-w-7xl w-full mx-auto md:px-0 px-4'>
                            <div className='flex -mt-10 md:-mt-20 space-x-3 items-center'>
                                <div
                                    className={`${uploadingAvatar ? `animate-pulse` : ``} w-20 h-20 md:w-36 md:h-36 my-2 group rounded-full relative z-20 flex items-center justify-center dark:border-[#2D2D33] border-white border-4`}
                                    style={{
                                    backgroundImage: `url(${newAvatar})`,
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                }}>
                                    <input
                                        ref={fileInput}
                                        type='file'
                                        accept='image/*'
                                        onChange={handleProfilePicUpload}
                                        style={{ display: "none" }}
                                    />
                                    <button onClick={() => fileInput.current.click()} className='bg-white/[.7] dark:bg-black/[.7] hidden group-hover:flex rounded-full px-2 py-2 hover:bg-white/[.9]'>
                                        <BiUpload size={24} />
                                    </button>
                                </div>
                            </div>
                            <div className='flex w-full md:flex-row flex-col space-x-0 space-y-0 md:space-y-0 md:space-x-10 mt-5'>
                                <div className='flex w-full flex-col'>
                                    <div className='mb-4 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Name</label>
                                        <input
                                            type='text'
                                            placeholder='Display Name'
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                        />
                                    </div>
                                    <div className='mb-4 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Handle</label>
                                        <input
                                            type='text'
                                            onChange={handleUsernameChange}
                                            value={username}
                                            placeholder='Set your handle'
                                            className="w-full text-sm py-2.5 px-3 active-primary border theme-border rounded-md focus:outline-none"
                                        />
                                        {checkingUsername && !isUsernameAvailable && (
                                            <div className='flex items-center'>
                                                <p className='text-xs text-gray-400'>
                                                    Checking Username Availability{" "}
                                                </p>
                                                <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 ml-1'></div>
                                            </div>
                                        )}
                                        {isUsernameAvailable && !checkingUsername && username != "" && (
                                            <div className='flex items-center'>
                                                <p className='text-sm text-green-500'>
                                                    Username is available
                                                </p>
                                            </div>
                                        )}
                                        {!isUsernameAvailable && !checkingUsername && username != "" && (
                                            <div className='flex items-center'>
                                                <p className='text-sm text-red-500'>
                                                    Username is not available
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className='mb-4 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Description</label>
                                        <textarea
                                            type='text'
                                            onChange={(e) => setProfileDescription(e.target.value)}
                                            value={profileDescription}
                                            placeholder='Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places.'
                                            className="w-full text-sm py-2.5 px-3 resize-none h-36 bg-secondary border theme-border rounded-md focus:outline-none"
                                        >
                                        </textarea>
                                    </div>
                                    <div className='mb-6 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Location</label>
                                        <input
                                            type='text'
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder='Add Location'
                                            className="w-full text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                        />
                                    </div>
                                    <div className='mb-4 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Language</label>
                                        <input
                                            type='text'
                                            value={languages}
                                            onChange={(e) => setLanguages(e.target.value)}
                                            placeholder='Add Language'
                                            className="w-full text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                        />
                                    </div>
                                    <div className='hidden md:block'>
                                        <Button
                                            variant='primary'
                                            size='md'
                                                loading = { loading }
                                            onClick={updateChannel}
                                        >
                                            Create Profile
                                        </Button>
                                    </div>
                                </div>
                                <div className='flex w-full flex-col'>
                                    <div className='mb-4 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Twitter</label>
                                        <div className='flex'>
                                            <input
                                                type='text'
                                                value={twitterLink}
                                                onChange={(e) => setTwitterLink(e.target.value)}
                                                placeholder='Set your twitter username'
                                                className="w-full text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className='mb-4 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Instagram</label>
                                        <div className='flex'>
                                            <input
                                                type='text'
                                                onChange={(e) => setInstagramLink(e.target.value)}
                                                value={instagramLink}
                                                placeholder='Set your instagram username'
                                                className="w-full text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className='mb-4 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Youtube</label>
                                        <div className='flex'>
                                            <input
                                                type='text'
                                                value={youtubeLink}
                                                onChange={(e) => setYoutubeLink(e.target.value)}
                                                placeholder='Set your youtube url'
                                                className="w-full text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className='mb-4 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Discord</label>
                                        <div className='flex'>
                                            <input
                                                type='text'
                                                value={discordLink}
                                                onChange={(e) => setDiscordLink(e.target.value)}
                                                placeholder='Set your discord url'
                                                className="w-full flex-1 text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className='mb-4 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Website</label>
                                        <div className='flex md:flex-row flex-col space-x-0 space-y-2 md:space-y-0 md:space-x-3'>
                                            <div className='w-full md:max-w-[200px]'>
                                                <input
                                                    type='text'
                                                    value={websiteTitle}
                                                    onChange={(e) => setWebsiteTitle(e.target.value)}
                                                    placeholder='Set title'
                                                    className="w-full text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                                />
                                            </div>
                                            <div className='flex flex-1'>
                                                <input
                                                    type='text'
                                                    value={websiteLink}
                                                    onChange={(e) => setWebsiteLink(e.target.value)}
                                                    placeholder='Set your website url'
                                                    className="w-full text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mb-4 flex flex-col space-y-2'>
                                        <label className='font-medium text-sm'>Custom</label>
                                        <div className='flex md:flex-row flex-col space-x-0 space-y-2 md:space-y-0 md:space-x-3'>
                                            <div className='w-full md:max-w-[200px]'>
                                                <input
                                                    type='text'
                                                    value={customTitle}
                                                    onChange={(e) => setCustomTitle(e.target.value)}
                                                    placeholder='Set title'
                                                    className="w-full text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                                />
                                            </div>
                                            <div className='flex flex-1'>
                                                <input
                                                    type='text'
                                                    value={customLink}
                                                    onChange={(e) => setCustomLink(e.target.value)}
                                                    placeholder='Set your custom url'
                                                    className="w-full text-sm py-2.5 px-3 bg-secondary border theme-border rounded-md focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='block md:hidden'>
                                        <Button
                                            variant='primary'
                                            size='md'
                                                loading = { loading }
                                            onClick={updateChannel}
                                        >
                                            Create Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Form