import manifest from '../data/image-manifest.json';

export type ImageName = keyof typeof manifest;

type Props = {
  name: ImageName;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** CSS object-position, for tuning crops inside fixed-ratio frames. */
  position?: string;
};

const srcset = (name: string, widths: number[], ext: 'webp' | 'jpg') =>
  widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(', ');

export function imageUrl(name: ImageName, width?: number, ext: 'webp' | 'jpg' = 'jpg'): string {
  const widths = manifest[name].widths;
  const w = width && widths.includes(width) ? width : widths[widths.length - 1];
  return `/images/${name}-${w}.${ext}`;
}

/** Responsive <picture> with WebP + JPEG fallbacks and intrinsic dimensions (no layout shift). */
export function Picture({ name, alt, sizes, className, priority, position }: Props) {
  const { width, height, widths } = manifest[name];
  const fallback = widths[Math.min(1, widths.length - 1)];
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={srcset(name, widths, 'webp')} sizes={sizes} />
      <img
        src={`/images/${name}-${fallback}.jpg`}
        srcSet={srcset(name, widths, 'jpg')}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchpriority: 'high' } : {})}
        style={position ? { objectPosition: position } : undefined}
      />
    </picture>
  );
}
