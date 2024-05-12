export interface FaqItem {
  question: string;
  answer: string;
}

export interface BannerImage {
  public_id: string;
  url: string;
}

export interface Category {
  title: string;
}

export interface Banner {
  title: string;
  image: BannerImage;
  subtitle: string;
}

export interface Layout {
  type: string;
  faq: FaqItem[];
  banner: Banner;
  categories: Category[];
}
