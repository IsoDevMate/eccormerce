export type Gender = "women" | "men" | "unisex";

export type Category =
  | "dresses"
  | "tops"
  | "knit"
  | "outerwear"
  | "bottoms"
  | "lounge"
  | "accessories";

export type ImageKind = "model" | "studio" | "detail" | "ugc";

export type ProductImage = {
  src: string;
  alt: string;
  kind: ImageKind;
};

export type SizeStock = {
  size: string;
  inStock: boolean;
};

export type ColorVariant = {
  id: string;
  name: string;
  hex: string;
  sizes: SizeStock[];
  images: ProductImage[];
};

export type Measurement = {
  chest?: number;
  waist?: number;
  hip?: number;
  length: number;
  sleeve?: number;
};

export type Product = {
  id: string;
  slug: string;
  code: string;
  name: string;
  line: string;
  gender: Gender;
  category: Category;
  price: number;
  compareAt?: number;
  badge?: "New" | "Best Seller" | "Limited";
  description: string;
  highlights: string[];
  materials: string;
  care: string;
  model: { name: string; heightCm: number; size: string };
  measurements: Record<string, Measurement>;
  fit: "slim" | "regular" | "relaxed" | "oversized";
  shippingDays: { min: number; max: number };
  video?: string;
  comingSoon?: boolean;
  variants: ColorVariant[];
  related: string[];
  createdAt: string;
};
