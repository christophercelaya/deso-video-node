import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/router';
import { DefaultSeo } from 'next-seo';
import NextNProgress from 'nextjs-progressbar';
import { useEffect, useState } from 'react'
import { Devtools } from '@components/DevTools';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DEFAULT_SEO, queryConfig, queryConfigAuto } from '@utils/constants';
import Layout from '@components/Common/Layout';
import VideoMetaTags from '@components/Common/VideoMetaTags';
import { LivepeerConfig } from '@livepeer/react';

import "react-multi-carousel/lib/styles.css";
import '@styles/globals.scss'
import { livepeerClient, playerTheme } from '@app/utils/functions/getLivePeer';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [config, setConfig] = useState(queryConfig);

  useEffect(() => {
    if (router.pathname === '/watch/[id]') {
      setConfig(queryConfig);
    } else {
      setConfig(queryConfigAuto);
    }
  }, [router]);

  const [queryClient] = useState(() => new QueryClient(config))

  return (
    <>
      <VideoMetaTags/>
      <ThemeProvider enableSystem={false} attribute="class">
        <NextNProgress color="#db2777" showOnShallow={true} />
        <DefaultSeo {...DEFAULT_SEO}/>
        <LivepeerConfig dehydratedState={pageProps?.dehydratedState} client={livepeerClient()} theme={playerTheme}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <Devtools />
            </Hydrate>
          </QueryClientProvider>
        </LivepeerConfig>
      </ThemeProvider>
    </>
  )
}

export default MyApp
