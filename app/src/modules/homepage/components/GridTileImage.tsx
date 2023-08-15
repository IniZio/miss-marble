import Translated from '@/components/Translated';
import { cn } from '@/lib/utils/ui';
import { type Translation } from '@/models/translation';
import Image from 'next/image';

const GridTileImageLabel = ({
  title,
  position = 'bottom'
}: {
  title: Translation;
  position?: 'bottom' | 'center';
}) => {
  return (
    <div
      className={cn('absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label', {
        'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="mr-2 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">
          <Translated t={title} />
        </h3>
      </div>
    </div>
  );
};

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: Translation;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={cn(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black',
        {
          relative: label,
          'border-2 border-blue-600': active,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
    >
      {props.src ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
        <Image
          className={cn('relative h-full w-full object-contain', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <GridTileImageLabel
          title={label.title}
          position={label.position}
        />
      ) : null}
    </div>
  );
}