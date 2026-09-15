export const siteConfig = {
  language: "en",
  locale: "en_US",
  siteUrl: undefined as string | undefined,
  siteMode: "local" as "local" | "production",
  contentStatus: "demo" as "demo" | "draft" | "ready",
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about/" },
    { label: "Products", href: "/products/" },
    { label: "Contact", href: "/contact/" },
  ],
};
