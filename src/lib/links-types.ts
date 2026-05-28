export type HeroTag = {
  label: string;
  kind: "dot" | "text";
  color?: string;
};

export type Hero = {
  eyebrow: string;
  title: string;
  logo: string;
  description: string;
  tags: HeroTag[];
};

export type LocationData = {
  chipLabel: string;
  mapUrl: string;
  addressLines: string[];
  cardTitle: string;
  cardSubtitle: string;
};

export type FeaturedCard = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  icon: string;
};

export type ContactLinkType = "phone" | "email" | "url" | "whatsapp";

export type ContactItem = {
  id: string;
  title: string;
  subtitle: string;
  linkType: ContactLinkType;
  value: string;
  icon: string;
  iconColor: string;
};

export type SocialItem = {
  id: string;
  title: string;
  handle: string;
  href: string;
  icon: string;
  brandColor: string;
};

export type LinksData = {
  hero: Hero;
  location: LocationData;
  featured: FeaturedCard;
  contactItems: ContactItem[];
  socialItems: SocialItem[];
  footer: string;
};
