import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import NextImage from 'next/image';
import { ComponentProps, ReactEventHandler, useState } from 'react';
import { FALLBACK_IMAGE_URL } from '~/constants';

type ImageProps = ComponentProps<typeof NextImage> & { fallback?: string | StaticImport };

export default function Image({ src, fallback, onError, ...props }: ImageProps) {
  const [error, setError] = useState<boolean>(false);
  const srcValue = src ?? FALLBACK_IMAGE_URL;

  const handleError: ReactEventHandler<HTMLImageElement> = (event) => {
    setError(true);
    onError?.(event);
  };

  return <NextImage src={error ? fallback ?? FALLBACK_IMAGE_URL : srcValue} {...props} onError={handleError} />;
}
