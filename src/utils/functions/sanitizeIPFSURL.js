import { IPFS_GATEWAY } from "../constants"


const sanitizeIPFSURL = (url) => {
  const ipfsGateway = `${IPFS_GATEWAY}/`
  if (!url) {
    return url
  }

  return url
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${ipfsGateway}/${url}`)
    .replace('https://ipfs.io/ipfs', ipfsGateway)
    .replace('https://ipfs.infura.io/ipfs', ipfsGateway)
    .replace('ipfs://', ipfsGateway)
    .replace('ipfs://ipfs/', ipfsGateway)
}

export default sanitizeIPFSURL