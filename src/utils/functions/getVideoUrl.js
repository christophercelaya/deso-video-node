export const getVideoUrl = (video) => {
  const url = video.VideoURLs[0].replace('iframe.', '')
  return url
}

export const getOriginalVideoUrl = (video) => {
  const url = video.VideoURLs[0]
  return url
}

export const getIsLivePeerUrl = (video) => {
  const url = video.VideoURLs[0]
  const splitUrl = url.split('/')
  const isLivePeer = splitUrl[2] === 'lvpr.tv'
  return isLivePeer
}

export const getPlaybackIdFromUrl = (video) => {
  const url = video.VideoURLs[0]
  const isLivePeerUrl = getIsLivePeerUrl(video)
  if (isLivePeerUrl) {
    const splitUrl = url.split('/')
    const playbackId = splitUrl[splitUrl.length - 1]
    return playbackId.replace('?v=', '')
  } else {
    const splitUrl = url.split('/')
    const playbackId = splitUrl[splitUrl.length - 1]
    return playbackId
  }
}