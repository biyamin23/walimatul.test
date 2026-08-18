/**
 * WALIMATUL — Template Registry
 *
 * Maps component_key (from DB templates.component_key) to the React component
 * that renders that invitation design.
 *
 * Rules:
 *   - A template is only usable if BOTH conditions are true:
 *     1. DB: templates.is_active = true
 *     2. Code: component_key exists in this registry
 *   - An active DB row with no registry entry = "unavailable" state (show gracefully).
 *   - Unknown component keys must NEVER cause a crash.
 *
 * Adding a new template:
 *   1. Create the component in templates/{slug}/Template.tsx
 *   2. Add it to TEMPLATE_REGISTRY below
 *   3. Update the DB seed/migration with the matching component_key
 *
 * @see templates/types.ts for the InvitationTemplateData contract
 */

import type { TemplateComponent, TemplateRegistryEntry } from "./types";
import { BlushGardenTemplate } from "./blush-garden/Template";
import { HybridEditorialTemplate } from "./hybrid-editorial/Template";

// ─── Registry ─────────────────────────────────────────────────────────────────

/**
 * Central registry of all implemented template components.
 * Key = templates.component_key in Supabase DB.
 */
const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  "blush-garden": {
    componentKey: "blush-garden",
    name: "Blush Garden",
    component: BlushGardenTemplate,
  },
  "hybrid-editorial": {
    componentKey: "hybrid-editorial",
    name: "Hybrid Editorial",
    component: HybridEditorialTemplate,
  },
};

// ─── Registry Helpers ─────────────────────────────────────────────────────────

/**
 * Check whether a component_key has an implemented component in the registry.
 * Use this before deciding to render or show "Use This Template" CTA.
 *
 * @example
 * if (!isTemplateComponentAvailable(template.component_key)) {
 *   return <UnavailableState />;
 * }
 */
export function isTemplateComponentAvailable(componentKey: string): boolean {
  return componentKey in TEMPLATE_REGISTRY;
}

/**
 * Get the React component for a given component_key.
 * Returns null if the key is not in the registry (never throws).
 *
 * Always check isTemplateComponentAvailable() before calling getTemplateComponent()
 * if you need a defined result.
 *
 * @example
 * const TemplateComponent = getTemplateComponent(template.component_key);
 * if (!TemplateComponent) return <UnavailableState />;
 * return <TemplateComponent data={invitationData} mode="live" />;
 */
export function getTemplateComponent(
  componentKey: string,
): TemplateComponent | null {
  const entry = TEMPLATE_REGISTRY[componentKey];
  if (!entry) {
    // Log safely — never throw on an unknown template key.
    // The DB may reference a component_key that hasn't been deployed yet.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[WALIMATUL] Template component not found for key: "${componentKey}". ` +
          `The DB template may be active but the component is not yet implemented. ` +
          `Add the component to templates/registry.ts to resolve this.`,
      );
    }
    return null;
  }
  return entry.component;
}

/**
 * Get the full registry entry for a component_key (includes name + component).
 * Returns null if not found.
 */
export function getTemplateRegistryEntry(
  componentKey: string,
): TemplateRegistryEntry | null {
  return TEMPLATE_REGISTRY[componentKey] ?? null;
}

/**
 * List all currently registered template component keys.
 * Useful for build-time checks or admin tooling.
 */
export function getRegisteredComponentKeys(): string[] {
  return Object.keys(TEMPLATE_REGISTRY);
}
