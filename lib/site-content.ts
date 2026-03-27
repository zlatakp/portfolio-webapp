import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "./prisma";

export const SITE_CONTENT_ID = "site-content";
export const DEFAULT_PUBLIC_THEME_ID = "editorial-sand";
export const PUBLIC_THEME_IDS = [
  "editorial-sand",
  "midnight-olive",
  "black-tie",
] as const;

const publicThemeIdSchema = z.enum(PUBLIC_THEME_IDS);

const siteImageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  alt: z.string().min(1),
  url: z.string().url(),
  caption: z.string().min(1),
});

const siteContentTextSchema = z.object({
  theme: z.object({
    themeId: publicThemeIdSchema,
  }),
  header: z.object({
    brandName: z.string().min(1),
    eyebrow: z.string().min(1),
    bookingCtaLabel: z.string().min(1),
  }),
  footer: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    description: z.string().min(1),
    bookingPrompt: z.string().min(1),
  }),
  home: z.object({
    metadataTitle: z.string().min(1),
    metadataDescription: z.string().min(1),
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    primaryCtaLabel: z.string().min(1),
    secondaryCtaLabel: z.string().min(1),
    spotlightEyebrow: z.string().min(1),
    spotlightTitle: z.string().min(1),
    spotlightDescription: z.string().min(1),
    primaryStatValue: z.string().min(1),
    primaryStatLabel: z.string().min(1),
    secondaryStatValue: z.string().min(1),
    secondaryStatLabel: z.string().min(1),
    galleryEyebrow: z.string().min(1),
    galleryTitle: z.string().min(1),
    servicesEyebrow: z.string().min(1),
    servicesTitle: z.string().min(1),
    servicesDescription: z.string().min(1),
  }),
  portfolio: z.object({
    metadataTitle: z.string().min(1),
    metadataDescription: z.string().min(1),
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    galleryEyebrow: z.string().min(1),
    galleryTitle: z.string().min(1),
    galleryDescription: z.string().min(1),
  }),
  services: z.object({
    metadataTitle: z.string().min(1),
    metadataDescription: z.string().min(1),
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    highlightEyebrow: z.string().min(1),
    highlightTitle: z.string().min(1),
    highlightDescription: z.string().min(1),
    bookingCtaLabel: z.string().min(1),
  }),
  about: z.object({
    metadataTitle: z.string().min(1),
    metadataDescription: z.string().min(1),
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    introduction: z.string().min(1),
    story: z.string().min(1),
    processEyebrow: z.string().min(1),
    processTitle: z.string().min(1),
    processStepOneTitle: z.string().min(1),
    processStepOneDescription: z.string().min(1),
    processStepTwoTitle: z.string().min(1),
    processStepTwoDescription: z.string().min(1),
    processStepThreeTitle: z.string().min(1),
    processStepThreeDescription: z.string().min(1),
  }),
});

export const siteContentSchema = siteContentTextSchema.extend({
  placeholderImages: z.object({
    homeHero: siteImageSchema,
    servicesSpotlight: siteImageSchema,
    aboutPortrait: siteImageSchema,
    portfolioGallery: z.array(siteImageSchema).min(1),
  }),
});

export const siteContentEditableSchema = siteContentTextSchema;

export type SiteContentImage = z.infer<typeof siteImageSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;
export type SiteContentEditableInput = z.infer<typeof siteContentEditableSchema>;
export type PublicThemeId = (typeof PUBLIC_THEME_IDS)[number];

export interface PublicThemeTokens {
  shellBackground: string;
  headerSurface: string;
  headerBorder: string;
  primaryText: string;
  mutedText: string;
  primaryCtaBackground: string;
  primaryCtaText: string;
  primaryCtaHover: string;
  secondaryCtaBackground: string;
  secondaryCtaBorder: string;
  secondaryCtaText: string;
  secondaryCtaHover: string;
  cardSurface: string;
  cardBorder: string;
  accentPanelSurface: string;
  accentPanelText: string;
  darkPanelSurface: string;
  darkPanelText: string;
  footerSurface: string;
  imageOverlayText: string;
  imageOverlayMutedText: string;
  shadowColor: string;
}

export interface PublicThemePreset {
  id: PublicThemeId;
  label: string;
  description: string;
  previewSwatches: [string, string, string];
  tokens: PublicThemeTokens;
}

export const publicThemePresets: PublicThemePreset[] = [
  {
    id: "editorial-sand",
    label: "Editorial Sand",
    description: "Warm parchment neutrals with bronze depth for a soft luxury tone.",
    previewSwatches: ["#fcf7f1", "#c69666", "#241c18"],
    tokens: {
      shellBackground: "linear-gradient(180deg,#fcf7f1 0%,#f4e9dc 100%)",
      headerSurface: "rgba(252,247,241,0.9)",
      headerBorder: "rgba(214,196,176,0.8)",
      primaryText: "#201815",
      mutedText: "#6a5950",
      primaryCtaBackground: "#211917",
      primaryCtaText: "#fbf6f0",
      primaryCtaHover: "#463630",
      secondaryCtaBackground: "rgba(255,255,255,0.72)",
      secondaryCtaBorder: "#cdb9a5",
      secondaryCtaText: "#201815",
      secondaryCtaHover: "#ffffff",
      cardSurface: "rgba(255,250,245,0.92)",
      cardBorder: "#dfd0c2",
      accentPanelSurface: "radial-gradient(circle at top,#ead3bb 0%,#d1aa81 42%,#b67b54 100%)",
      accentPanelText: "#261a16",
      darkPanelSurface: "#221916",
      darkPanelText: "#f8efe6",
      footerSurface: "rgba(255,252,248,0.8)",
      imageOverlayText: "#fffaf5",
      imageOverlayMutedText: "rgba(255,244,232,0.82)",
      shadowColor: "rgba(88,56,31,0.18)",
    },
  },
  {
    id: "midnight-olive",
    label: "Midnight Olive",
    description: "Moss-inflected dusk tones with tailored contrast and a gallery mood.",
    previewSwatches: ["#111816", "#7f8f6f", "#f3efe6"],
    tokens: {
      shellBackground: "linear-gradient(180deg,#141b18 0%,#202926 100%)",
      headerSurface: "rgba(20,27,24,0.84)",
      headerBorder: "rgba(103,118,101,0.55)",
      primaryText: "#f1ede3",
      mutedText: "#c2c3b8",
      primaryCtaBackground: "#e8dcc8",
      primaryCtaText: "#17201c",
      primaryCtaHover: "#f4e9d8",
      secondaryCtaBackground: "rgba(34,45,41,0.74)",
      secondaryCtaBorder: "#839175",
      secondaryCtaText: "#f1ede3",
      secondaryCtaHover: "#30403a",
      cardSurface: "rgba(27,35,32,0.9)",
      cardBorder: "#44544b",
      accentPanelSurface: "radial-gradient(circle at top,#7b8b6c 0%,#596854 40%,#29342f 100%)",
      accentPanelText: "#f6f1e8",
      darkPanelSurface: "#0f1513",
      darkPanelText: "#eef0e7",
      footerSurface: "rgba(16,22,20,0.86)",
      imageOverlayText: "#f6f2ea",
      imageOverlayMutedText: "rgba(233,231,222,0.84)",
      shadowColor: "rgba(4,10,7,0.3)",
    },
  },
  {
    id: "black-tie",
    label: "Black Tie",
    description: "Monochrome luxury with champagne highlights and higher formal contrast.",
    previewSwatches: ["#0b0b0c", "#d9c4a3", "#faf7f2"],
    tokens: {
      shellBackground: "linear-gradient(180deg,#0c0d0e 0%,#17181b 100%)",
      headerSurface: "rgba(12,13,14,0.86)",
      headerBorder: "rgba(104,96,84,0.55)",
      primaryText: "#f7f2ea",
      mutedText: "#cbc2b6",
      primaryCtaBackground: "#dbc2a0",
      primaryCtaText: "#141212",
      primaryCtaHover: "#f0d7b6",
      secondaryCtaBackground: "rgba(25,26,29,0.78)",
      secondaryCtaBorder: "#8e7c66",
      secondaryCtaText: "#f7f2ea",
      secondaryCtaHover: "#303238",
      cardSurface: "rgba(21,22,25,0.92)",
      cardBorder: "#454140",
      accentPanelSurface: "radial-gradient(circle at top,#d7c0a1 0%,#9f8266 38%,#3a2f2b 100%)",
      accentPanelText: "#111010",
      darkPanelSurface: "#090909",
      darkPanelText: "#f8f3eb",
      footerSurface: "rgba(10,10,11,0.88)",
      imageOverlayText: "#faf6f0",
      imageOverlayMutedText: "rgba(238,228,214,0.84)",
      shadowColor: "rgba(0,0,0,0.36)",
    },
  },
];

export const defaultSiteContent: SiteContent = {
  theme: {
    themeId: DEFAULT_PUBLIC_THEME_ID,
  },
  header: {
    brandName: "Zlata Studio",
    eyebrow: "Portrait photography in London",
    bookingCtaLabel: "Book a session",
  },
  footer: {
    eyebrow: "Photography studio",
    heading: "Elegant sessions, calm direction, lasting images.",
    description:
      "A refined portrait experience for editorials, milestones, and personal branding sessions.",
    bookingPrompt:
      "Use the direct booking flow to request your preferred date and time without leaving the site.",
  },
  home: {
    metadataTitle: "Portrait Photography in London",
    metadataDescription:
      "Browse a premium portrait photography portfolio and book editorial, milestone, and personal branding sessions directly online.",
    eyebrow: "Photographer portfolio and booking",
    title: "Portraits and stories with a cinematic, editorial calm.",
    description:
      "A premium, image-led experience for clients who want thoughtful direction, graceful pacing, and photographs with texture and presence.",
    primaryCtaLabel: "Book a session",
    secondaryCtaLabel: "View portfolio",
    spotlightEyebrow: "Studio approach",
    spotlightTitle: "An experience shaped around ease, intimacy, and confident art direction.",
    spotlightDescription:
      "From the first inquiry to the final gallery, every step is designed to feel personal, steady, and beautifully uncomplicated on both mobile and desktop.",
    primaryStatValue: "1:1",
    primaryStatLabel: "Guided direction from planning to delivery",
    secondaryStatValue: "3",
    secondaryStatLabel: "Signature session formats ready to book",
    galleryEyebrow: "Featured work",
    galleryTitle: "A portfolio built around intimacy, atmosphere, and texture.",
    servicesEyebrow: "Services",
    servicesTitle: "Session offerings with a direct path into booking.",
    servicesDescription:
      "The live service list remains connected to the booking system, so clients can move from inspiration to inquiry in one place.",
  },
  portfolio: {
    metadataTitle: "Portfolio",
    metadataDescription:
      "View the latest portrait, milestone, and editorial imagery from the studio portfolio.",
    eyebrow: "Portfolio",
    title: "Frames shaped by softness, movement, and intentional light.",
    description:
      "The gallery pairs live uploads from the studio archive with a curated fallback selection so the public experience always feels visual and complete.",
    galleryEyebrow: "Gallery",
    galleryTitle: "Atmospheric portraits, editorial motion, and quiet detail.",
    galleryDescription:
      "When the live portfolio is still growing, curated placeholder imagery keeps the page polished without changing the upload workflow.",
  },
  services: {
    metadataTitle: "Photography Services",
    metadataDescription:
      "Explore available photography sessions, pricing, and durations before entering the direct booking flow.",
    eyebrow: "Services",
    title: "Session types designed for portraits, milestones, and brand stories.",
    description:
      "Every active service below comes directly from the admin-managed booking catalogue, wrapped here in a more editorial presentation.",
    highlightEyebrow: "Client experience",
    highlightTitle: "A booking path that feels bespoke instead of transactional.",
    highlightDescription:
      "Clients can browse the work, choose the right session, and request a time in one focused flow without signing up for another scheduling tool.",
    bookingCtaLabel: "Book now",
  },
  about: {
    metadataTitle: "About the Studio",
    metadataDescription:
      "Learn about the studio approach, client experience, and how the direct booking process works from inquiry to confirmation.",
    eyebrow: "About",
    title: "A calm, guided portrait experience from inquiry to delivery.",
    introduction:
      "The studio focuses on intimate portraiture, milestone sessions, and editorial brand imagery with an approach that is warm, observant, and gently directed.",
    story:
      "Clients are invited into a process that feels clear from the start: explore the work, choose the session that fits, and request a time directly on site while the back office keeps everything organized behind the scenes.",
    processEyebrow: "What to expect",
    processTitle: "A three-step journey designed to stay clear and reassuring.",
    processStepOneTitle: "1. Explore the work",
    processStepOneDescription:
      "Browse the portfolio and choose the session that best fits the story, season, or milestone you want to capture.",
    processStepTwoTitle: "2. Request your time",
    processStepTwoDescription:
      "Use the direct booking flow to select an available slot and send your details without creating an account.",
    processStepThreeTitle: "3. Receive confirmation",
    processStepThreeDescription:
      "Automated updates keep the experience polished while leaving room for the studio to add a personal touch.",
  },
  placeholderImages: {
    homeHero: {
      id: "home-hero",
      name: "Studio portrait in window light",
      alt: "A softly lit portrait with a warm editorial mood.",
      url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
      caption: "Soft window light and sculpted styling for editorial portrait sessions.",
    },
    servicesSpotlight: {
      id: "services-spotlight",
      name: "Client styling detail",
      alt: "A close-up portrait detail with fashion-inspired styling.",
      url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80",
      caption: "Session planning balances polished styling with natural, easy direction.",
    },
    aboutPortrait: {
      id: "about-portrait",
      name: "Relaxed portrait on location",
      alt: "A portrait subject standing outdoors in warm late-afternoon light.",
      url: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1400&q=80",
      caption: "Calm pacing and attentive direction help clients settle into the frame.",
    },
    portfolioGallery: [
      {
        id: "portfolio-01",
        name: "Golden-hour portrait",
        alt: "A woman in golden-hour light wearing a tailored neutral outfit.",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
        caption: "Soft glamour and clean composition for portrait-led storytelling.",
      },
      {
        id: "portfolio-02",
        name: "Editorial motion study",
        alt: "A portrait with gentle motion and blurred fabric movement.",
        url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
        caption: "Movement is used sparingly to keep the work expressive and composed.",
      },
      {
        id: "portfolio-03",
        name: "Quiet indoor portrait",
        alt: "A seated portrait in a softly styled interior.",
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
        caption: "Interiors are chosen for warmth, texture, and subtle architectural detail.",
      },
      {
        id: "portfolio-04",
        name: "Studio close-up",
        alt: "A close-up portrait with clean beauty lighting.",
        url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80",
        caption: "Close portrait work centers expression, skin tone, and sculpted light.",
      },
      {
        id: "portfolio-05",
        name: "City editorial",
        alt: "A fashion-forward portrait captured on a city street.",
        url: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80",
        caption: "Location portraits combine elegance with a sense of movement and place.",
      },
      {
        id: "portfolio-06",
        name: "Milestone portrait",
        alt: "A warm portrait celebrating a personal milestone.",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
        caption: "Milestone sessions are guided with restraint so the emotion stays central.",
      },
    ],
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(defaults: T, value: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(value) ? value : defaults) as T;
  }

  if (isPlainObject(defaults)) {
    const result: Record<string, unknown> = {};
    const incoming = isPlainObject(value) ? value : {};

    for (const key of Object.keys(defaults)) {
      result[key] = mergeDeep(
        defaults[key as keyof typeof defaults],
        incoming[key],
      );
    }

    return result as T;
  }

  return value === undefined || value === null ? defaults : (value as T);
}

export function resolveSiteContent(rawContent?: Prisma.JsonValue | null): SiteContent {
  const mergedContent = mergeDeep(defaultSiteContent, rawContent);

  if (
    !mergedContent.theme ||
    !publicThemeIdSchema.safeParse(mergedContent.theme.themeId).success
  ) {
    mergedContent.theme = {
      themeId: DEFAULT_PUBLIC_THEME_ID,
    };
  }

  return siteContentSchema.parse(mergedContent);
}

export function getEditableSiteContent(
  content: SiteContent,
): SiteContentEditableInput {
  return siteContentEditableSchema.parse({
    theme: content.theme,
    header: content.header,
    footer: content.footer,
    home: content.home,
    portfolio: content.portfolio,
    services: content.services,
    about: content.about,
  });
}

export function mergeSiteContent(
  currentContent: SiteContent,
  editableContent: SiteContentEditableInput,
): SiteContent {
  return siteContentSchema.parse({
    ...mergeDeep(currentContent, editableContent),
    placeholderImages: currentContent.placeholderImages,
  });
}

export function getPublicThemePresets(): PublicThemePreset[] {
  return publicThemePresets;
}

export function getSelectedPublicTheme(content: SiteContent): PublicThemePreset {
  return (
    publicThemePresets.find((preset) => preset.id === content.theme.themeId) ??
    publicThemePresets[0]
  );
}

export async function getSiteContent(): Promise<SiteContent> {
  const siteContent = await prisma.siteContent.findUnique({
    where: {
      id: SITE_CONTENT_ID,
    },
    select: {
      content: true,
    },
  });

  return resolveSiteContent(siteContent?.content ?? null);
}
