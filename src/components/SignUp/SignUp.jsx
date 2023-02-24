import usePersistStore from '@app/store/persist'
import { APP, MIN_DESO_TO_CREATE_PROFILE } from '@app/utils/constants'
import Deso from 'deso-protocol'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import GetDeSo from './GetDeso'
import { NextSeo } from 'next-seo'
import { nanosToUSDNumber } from '@app/utils/functions'
import Form from './Form'
import party from "party-js"

const SignUp = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [profileExists, setProfileExists] = useState(false);
    const [balance, setBalance] = useState(0);
    const { setLoggedIn, isLoggedIn, newUser, isNewUser, user, setUser, setIsNewUser, setNewUser } = usePersistStore()

    useEffect(() => {
        if (isNewUser) {
            initSignUpStage();
        } else {
            router.push('/')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const initSignUpStage = async() => {
        const deso = new Deso();
        let loggedInDeSoPublicKey = newUser?.profile?.key;
        try {
            if (loggedInDeSoPublicKey) {
                const request = {
                    PublicKeysBase58Check: [loggedInDeSoPublicKey],
                };
                const response = await deso.user.getUserStateless(request);
                let hasProfile = response.UserList[0].ProfileEntryResponse !== null;
                setProfileExists(hasProfile);
                setBalance(nanosToUSDNumber(response.UserList[0].BalanceNanos));

                if (hasProfile) {
                    router.push('/')
                } else {
                    setNewUser({ profile: response.UserList[0] });
                }
            } else {
                router.push('/')
            }
        } catch (error) {
            console.log(error);
            //router.push('/')
        }
    }
    return (
        <>
            <NextSeo
                title='Sign Up :: Videso'
                canonical={`${APP.URL}${router.asPath}`}
                openGraph={{
                    title: 'Sign Up :: Videso',
                    url: `${APP.URL}${router.asPath}`,
                }}
            />
            <div className='md:px-16 px-4 max-w-7xl mx-auto mt-5'>
                {isNewUser && newUser.profile && !profileExists ? (
                    <>
                        {balance >= MIN_DESO_TO_CREATE_PROFILE ? (
                            <div className="space-y-2 w-full md:w-auto flex flex-col">
                                <Form/>
                            </div>
                        ) : (
                            <div className='max-w-3xl mx-auto'>
                                <div className='bg-gray-100 rounded-md p-4'>
                                    <div className='flex flex-col space-y-4 items-center justify-center'>
                                        <GetDeSo
                                            publicKey={newUser?.profile?.PublicKeyBase58Check}
                                            balance={balance}
                                            setBalance={setBalance}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ): null}
            </div>
        </>
    )
}

export default SignUp