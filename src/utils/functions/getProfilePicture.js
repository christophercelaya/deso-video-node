import { APP } from "../constants";
import { getProfileExtraData } from "./getProfileExtraData";

export const getProfilePicture = (channel) => {
  const channelExtra = getProfileExtraData(channel);
  const largeImage = channelExtra?.ProfileImage !== '' ? channelExtra?.ProfileImage  : channelExtra?.LargeProfilePicURL !== null ? channelExtra?.LargeProfilePicURL  : null

  const url = largeImage ? largeImage : channel?.PublicKeyBase58Check ? `https://diamondapp.com/api/v0/get-single-profile-picture/${channel.PublicKeyBase58Check}?fallback=${APP.URL}/default_profile_pic.png` : `${APP.URL}/default_profile_pic.png`;
  return url;
}
