export const BRAND_ASSET_PATHS = {
  sourceSvg: "assets/pearce/app-icon.svg",
  markSvg: "assets/pearce/mark.svg",

  developmentIconComposerProject: "assets/pearce/app-icon.svg",
  developmentIosIconPng: "assets/pearce/app-icon-1024.png",
  developmentUniversalIconPng: "assets/pearce/android-foreground-432.png",

  productionIconComposerProject: "assets/pearce/app-icon.svg",
  productionIosIconPng: "assets/pearce/app-icon-1024.png",
  productionMacIconPng: "assets/pearce/app-icon-macos-1024.png",
  productionLinuxIconPng: "assets/pearce/app-icon-1024.png",
  productionWindowsIconIco: "assets/pearce/app-icon-windows.ico",
  productionWebFaviconIco: "assets/pearce/favicon.ico",
  productionWebFavicon16Png: "assets/pearce/favicon-16x16.png",
  productionWebFavicon32Png: "assets/pearce/favicon-32x32.png",
  productionWebAppleTouchIconPng: "assets/pearce/apple-touch-icon-180.png",

  nightlyIconComposerProject: "assets/pearce/app-icon.svg",
  nightlyIosIconPng: "assets/pearce/app-icon-1024.png",
  nightlyMacIconPng: "assets/pearce/app-icon-macos-1024.png",
  nightlyLinuxIconPng: "assets/pearce/app-icon-1024.png",
  nightlyWindowsIconIco: "assets/pearce/app-icon-windows.ico",
  nightlyWebFaviconIco: "assets/pearce/favicon.ico",
  nightlyWebFavicon16Png: "assets/pearce/favicon-16x16.png",
  nightlyWebFavicon32Png: "assets/pearce/favicon-32x32.png",
  nightlyWebAppleTouchIconPng: "assets/pearce/apple-touch-icon-180.png",

  developmentDesktopIconPng: "assets/pearce/app-icon-macos-1024.png",
  developmentWindowsIconIco: "assets/pearce/app-icon-windows.ico",
  developmentWebFaviconIco: "assets/pearce/favicon.ico",
  developmentWebFavicon16Png: "assets/pearce/favicon-16x16.png",
  developmentWebFavicon32Png: "assets/pearce/favicon-32x32.png",
  developmentWebAppleTouchIconPng: "assets/pearce/apple-touch-icon-180.png",
} as const;

export type WebAssetBrand = "development" | "nightly" | "production";

export const WEB_ASSET_CHANNELS = ["latest", "nightly"] as const;

export type WebAssetChannel = (typeof WEB_ASSET_CHANNELS)[number];

export function resolveWebAssetBrandForChannel(channel: WebAssetChannel): WebAssetBrand {
  return channel === "nightly" ? "nightly" : "production";
}

export function resolveWebAssetBrandForPackageVersion(version: string): WebAssetBrand {
  return version.includes("-nightly.") ? "nightly" : "production";
}

export interface IconOverride {
  readonly sourceRelativePath: string;
  readonly targetRelativePath: string;
}

const WEB_ICON_TARGET_FILENAMES = {
  faviconIco: "favicon.ico",
  favicon16Png: "favicon-16x16.png",
  favicon32Png: "favicon-32x32.png",
  appleTouchIconPng: "apple-touch-icon.png",
} as const;

const WEB_ICON_SOURCE_PATHS_BY_BRAND = {
  development: {
    faviconIco: BRAND_ASSET_PATHS.developmentWebFaviconIco,
    favicon16Png: BRAND_ASSET_PATHS.developmentWebFavicon16Png,
    favicon32Png: BRAND_ASSET_PATHS.developmentWebFavicon32Png,
    appleTouchIconPng: BRAND_ASSET_PATHS.developmentWebAppleTouchIconPng,
  },
  nightly: {
    faviconIco: BRAND_ASSET_PATHS.nightlyWebFaviconIco,
    favicon16Png: BRAND_ASSET_PATHS.nightlyWebFavicon16Png,
    favicon32Png: BRAND_ASSET_PATHS.nightlyWebFavicon32Png,
    appleTouchIconPng: BRAND_ASSET_PATHS.nightlyWebAppleTouchIconPng,
  },
  production: {
    faviconIco: BRAND_ASSET_PATHS.productionWebFaviconIco,
    favicon16Png: BRAND_ASSET_PATHS.productionWebFavicon16Png,
    favicon32Png: BRAND_ASSET_PATHS.productionWebFavicon32Png,
    appleTouchIconPng: BRAND_ASSET_PATHS.productionWebAppleTouchIconPng,
  },
} as const satisfies Record<WebAssetBrand, Record<keyof typeof WEB_ICON_TARGET_FILENAMES, string>>;

export function resolveWebIconOverrides(
  brand: WebAssetBrand,
  targetDirectory: string,
): ReadonlyArray<IconOverride> {
  const sourcePaths = WEB_ICON_SOURCE_PATHS_BY_BRAND[brand];
  return [
    {
      sourceRelativePath: sourcePaths.faviconIco,
      targetRelativePath: `${targetDirectory}/${WEB_ICON_TARGET_FILENAMES.faviconIco}`,
    },
    {
      sourceRelativePath: sourcePaths.favicon16Png,
      targetRelativePath: `${targetDirectory}/${WEB_ICON_TARGET_FILENAMES.favicon16Png}`,
    },
    {
      sourceRelativePath: sourcePaths.favicon32Png,
      targetRelativePath: `${targetDirectory}/${WEB_ICON_TARGET_FILENAMES.favicon32Png}`,
    },
    {
      sourceRelativePath: sourcePaths.appleTouchIconPng,
      targetRelativePath: `${targetDirectory}/${WEB_ICON_TARGET_FILENAMES.appleTouchIconPng}`,
    },
  ];
}

export const DEVELOPMENT_ICON_OVERRIDES = resolveWebIconOverrides("development", "dist/client");

export const DEVELOPMENT_PUBLIC_ICON_OVERRIDES = resolveWebIconOverrides(
  "development",
  "apps/web/public",
);
