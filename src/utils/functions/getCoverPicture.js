import { getProfileExtraData } from "./getProfileExtraData"

export const getCoverPicture = (channel) => {
  const channelExtra = getProfileExtraData(channel);
  const largeImage = channelExtra?.CoverImage !== null ? channelExtra?.CoverImage : null
  const url = largeImage ? largeImage : `/backgrounds/cover.jpg`
  return url
}