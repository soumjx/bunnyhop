import { useLoaderData } from 'react-router';
import type { Route } from './+types/_index';
import type { FeaturedCollectionFragment, RecommendedProductsQuery } from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'BUNNYHOP | EQUIP LOOT' }];
};

// --- DATA LOADERS (Keeping these so your API connection stays alive) ---
export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context }: Route.LoaderArgs) {
  const [{ collections }] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);
  return { featuredCollection: collections.nodes[0] };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });
  return { recommendedProducts };
}

// --- THE NEW DESIGN STARTS HERE ---
export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-white">
      
      {/* BACKGROUND GRID EFFECT */}
      <div className="pointer-events-none absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* HERO SECTION */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        
        {/* FLOATING BADGE */}
        <div className="mb-6 rotate-[-3deg] border-2 border-white bg-[#CCFF00] px-4 py-1 font-black text-black shadow-[4px_4px_0px_0px_#FFF]">
          GET ON THE HOP
        </div>

        {/* MAIN TITLE */}
        <h1 className="text-6xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-[9rem]">
          Bunny<span className="text-transparent" style={{ WebkitTextStroke: '2px #CCFF00' }}>Hop</span>
        </h1>

        <p className="mt-6 max-w-lg text-lg font-medium text-gray-400 md:text-2xl">
          High-performance deskmats for creators who <span className="text-[#CCFF00] underline decoration-wavy">don't miss.</span>
        </p>

        {/* CTA BUTTON */}
        <div className="mt-12">
           <button className="group relative cursor-pointer">
            {/* Button Shadow */}
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#CCFF00] transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
            {/* Button Face */}
            <div className="relative border-2 border-[#CCFF00] bg-black px-10 py-5 text-xl font-bold uppercase tracking-widest text-white hover:bg-[#CCFF00] hover:text-black">
              Secure Loot
            </div>
          </button>
        </div>

      </main>

      {/* TEMPORARY DEBUG: Checking if data is loading */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-700">
        {data.featuredCollection ? '✅ Shopify Connected' : '❌ Check API'}
      </div>
    </div>
  );
}

// --- GRAPHQL QUERIES (Must stay at bottom) ---
const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;