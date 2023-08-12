import Link from 'next/link';
import { type RecommendedProduct } from '../models/product';
import { GridTileImage } from './GridTileImage';
import { Routes } from 'generated';

function ProductsGridItem({
  item,
  size,
  priority
}: {
  item: RecommendedProduct;
  size: 'full' | 'half' | 'quarter';
  priority?: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : size === 'half' ? 'md:col-span-2 md:row-span-1' : 'md:col-span-1 md:row-span-[0.5]'}
    >
      <Link className="relative block aspect-square h-full w-full" href={Routes.ProductDetailPage({ id: item.id })}>
        <GridTileImage
          alt=""
          src={item.image?.url ?? ""}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : size === 'half' ? '(min-width: 768px) 33vw, 100vw' : '(min-width: 768px) 16vw, 100vw'
          }
          priority={priority}
          label={{
            // position: size === 'full' ? 'center' : 'bottom',
            position: 'bottom',
            title: item.name
          }}
        />
      </Link>
    </div>
  );
}

export function ProductsGrid({ products }: { products: RecommendedProduct[] }) {
  if (!products[0]) return null;

  return (
    <section className="mx-auto grid max-w-3xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ProductsGridItem size="full" item={products[0]} priority={true} />
      {products.slice(1).map((product) => (
        <ProductsGridItem size="half" key={product.id} item={product} />
      ))}
    </section>
  );
}