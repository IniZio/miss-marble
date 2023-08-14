import Link from 'next/link';
import { type RecommendedProduct } from '../models/product';
import { GridTileImage } from './GridTileImage';
import { Routes } from 'generated';

function ThreeItemGridItem({
  item,
  size,
  priority
}: {
  item: RecommendedProduct;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link className="relative block aspect-square h-full w-full" href={Routes.ProductDetailPage({ id: item.id })}>
        <GridTileImage
          alt=""
          src={item.image?.url ?? ""}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.name
          }}
        />
      </Link>
    </div>
  );
}

export function ThreeItemGrid({ products }: { products: RecommendedProduct[] }) {
  if (!products[0]) return null;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem size="full" item={products[0]} priority={true} />
      {products.slice(1).map((product) => (
        <ThreeItemGridItem size="half" key={product.id} item={product} />
      ))}
    </section>
  );
}