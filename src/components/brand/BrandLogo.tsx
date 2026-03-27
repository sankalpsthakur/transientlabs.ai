import {
  getBrandAsset,
  siteBrand,
  type BrandLogoTone,
  type BrandLogoVariant,
} from "@/lib/site-brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  tone?: BrandLogoTone;
  className?: string;
  alt?: string;
};

export function BrandLogo({
  variant = "lockup",
  tone = "light",
  className,
  alt = `${siteBrand.name} logo`,
}: BrandLogoProps) {
  const asset = getBrandAsset(variant, tone);

  return (
    <img
      src={asset.src}
      alt={alt}
      aria-label={alt}
      width={asset.width}
      height={asset.height}
      decoding="async"
      draggable={false}
      className={cn("h-auto w-auto", className)}
    />
  );
}
