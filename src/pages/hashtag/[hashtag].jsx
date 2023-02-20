import { GetHashtagFeed } from '@app/data/hashtag';
import { APP } from '@app/utils/constants';
import { withCSR } from '@app/utils/functions';
import { Hashtag } from '@components/Explore/Hashtag'
import { QueryClient, dehydrate } from '@tanstack/react-query';

export default Hashtag

export const getServerSideProps = withCSR(async (ctx) => {

    const { hashtag } = ctx.params;
    const queryClient = new QueryClient();
    const reader = APP.PublicKeyBase58Check;
    let isError = false;

    try {
        await queryClient.prefetchQuery([['hashtag-feed', hashtag], { hashtag: hashtag, reader: reader, limit: 32 }], GetHashtagFeed, { enabled: !!hashtag, })
    } catch (error) {
        isError = true
        ctx.res.statusCode = error.response.status;
    }
    return {
        props: {
            isError,
            dehydratedState: dehydrate(queryClient),
        },
    }
})