"use client";

export function CaseStudyImage({
  src,
  alt,
  className = "absolute inset-0 h-full w-full object-cover",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
