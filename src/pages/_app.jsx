import { DefaultSeo } from 'next-seo'
import '../styles/globals.scss'
import { DEFAULT_SEO } from '@app/constants'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo {...DEFAULT_SEO}/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
