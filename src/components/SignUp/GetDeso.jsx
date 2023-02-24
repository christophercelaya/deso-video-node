import Deso from "deso-protocol";
import { useEffect, useState } from "react";
import { Button } from "../UI/Button";
import useCopyToClipboard from "@app/utils/hooks/useCopyToClipboard";
import { toast } from "react-hot-toast";
import { BiCopy } from "react-icons/bi";
import { formatUSD, nanosToUSDNumber } from "@app/utils/functions";

const { MIN_DESO_TO_CREATE_PROFILE } = require("@app/utils/constants");

const GetDeSo = ({ publicKey, setBalance, balance }) => {
    const [showTransfer, setShowTransfer] = useState(false);
    const [isBeggin, setIsBegging] = useState(false);
    const [copy] = useCopyToClipboard()

    const onCopy = async () => {
        await copy(publicKey)
        toast.success('Public Key copied to clipboard!')
    }

    useEffect(() => {
        const deso = new Deso();
        const interval = setInterval(async () => {
            try {
                console.log("checking balance");

                const request = {
                    PublicKeysBase58Check: [publicKey],
                    SkipForLeaderboard: false,
                };
                const response2 = await deso.user.getUserStateless(request);
                if (nanosToUSDNumber(response2.UserList[0].BalanceNanos) >= MIN_DESO_TO_CREATE_PROFILE) {
                    //window.location.reload();
                    setBalance(nanosToUSDNumber(response2.UserList[0].BalanceNanos));
                }

                console.log(response2);
                console.log("done...");
            } catch (error) {
                console.log(error);
            }
        }, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getDeSoButton = () => {
        //ope new window in new browser tab
        setIsBegging(true);
        function openInNewTab() {
        const win = window.open(
            `https://identity.deso.org/verify-phone-number?public_key=${publicKey}`,
            "_blank",
            "width=600,height=800,left=500,top=80,toolbar=yes,location=yes,menubar=yes,status=yes"
        );

        win.focus();
            console.log(win);
        }
        openInNewTab();
    };
    return (
        <>
            <h3 className='text-2xl font-medium'>Get Starter $DESO</h3>
            <p className='font-medium text-center mb-4'>Enter your phone number or transfer your first $DESO.</p>
            <p className='text-center text-[14px] mt-4'>This is the cryptocurrency that fuels the DeSo blockchain and allows you to post to the decentralized social network.</p>
            <p className='font-medium'>Choose an option</p>
            <Button
                variant='primary'
                onClick={getDeSoButton}
            >
                Get $DESO with Phone Number
            </Button>

            {/* <h4 className='font-medium text-[14px] primary-button rounded-full w-10 h-10 text-center justify-center items-center flex'>OR</h4> */}
            <Button
                variant='dark'
                onClick={() => setShowTransfer(true)}
            >
                Transfer $DESO
            </Button>
            {showTransfer && (
                <>
                    <h4 className='font-medium'>Transfer $DESO to your new account</h4>
                    <p className="text-[14px] text-center">You will need at least {MIN_DESO_TO_CREATE_PROFILE} $DESO to create your new account. This could be transferred from an exchange like Coinbase, or from another account on a DeSo app like Diamond.</p>
                    <p className='font-medium'>Send $DESO to this address</p>
                    <p className='bg-white relative pl-4 pr-10 py-2 text-sm rounded-md cursor-pointer'>
                        <span onClick={onCopy}>{publicKey}</span>
                        <button
                            type="button"
                            onClick={onCopy}
                            className="flex items-center justify-center w-10 h-10 absolute -top-1 right-0"
                        >
                            <BiCopy size={23} round />
                        </button>
                    </p>
                    <p className="text-[14px] text-center">Your current balance {balance} $DESO</p>
                </>
            )}

            {isBeggin && (
                <p className='text-[14px] text-center mt-4'>
                    After verification, you will be redirected to home. Please wait...
                </p>
            )}
            <p className='text-[14px] text-center mt-4'></p>
        </>
    );
}

export default GetDeSo;