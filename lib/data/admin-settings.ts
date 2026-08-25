import "server-only";

export * from "@/lib/data/platform-settings";
import { getPlatformSettings } from "@/lib/data/platform-settings";

export const getAdminPlatformSettings = getPlatformSettings;
