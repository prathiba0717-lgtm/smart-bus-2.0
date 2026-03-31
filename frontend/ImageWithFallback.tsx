import { useState, type ImgHTMLAttributes } from "react";

type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement>;

export function ImageWithFallback({
  src,
  alt = "Image",
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-sm text-gray-600 ${props.className ?? ""}`}
      >
        {alt}
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
}
