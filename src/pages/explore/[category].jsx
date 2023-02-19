import { GetCategoryFeed } from '@app/data/explore';
import { APP } from '@app/utils/constants';
import { withCSR } from '@app/utils/functions';
import { Category } from '@components/Explore/Category'
import { QueryClient, dehydrate } from '@tanstack/react-query';

export default Category

export const getServerSideProps = withCSR(async (ctx) => {

    const { category } = ctx.params;
    const queryClient = new QueryClient();
    const reader = APP.PublicKeyBase58Check;
    let isError = false;

    try {
        await queryClient.prefetchQuery([['category-feed', category], { category: category, reader: reader, limit: 32 }], GetCategoryFeed, { enabled: !!category, })
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