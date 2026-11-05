"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { InternalLink } from "@/config/types";
import { homePage } from "@/content/home";
import { isFixedTemplate } from "@/lib/fixed-template/mode";
import { renderFixedDocument } from "@/lib/fixed-template/render";
import { assetPath, routePath } from "@/lib/urls";

export function FixedTemplateHeader({ links }: { links: InternalLink[] }) {
  const pathname = usePathname() || "/";
  return <FixedTemplateHeaderContent key={pathname} links={links} pathname={pathname} />;
}

function FixedTemplateHeaderContent({ links, pathname }: { links: InternalLink[]; pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  if (!isFixedTemplate()) return null;
  const skin = siteSkin();
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = path === "/" ? "home" : "inner";
  const currentSlug = page === "inner" ? path.split("/").filter(Boolean).at(-1) ?? "" : "";
  const nav = links
    .filter((link) => link.slug.replace(/^\/+|\/+$/g, ""))
    .map((link) => ({
      slug: link.slug.replace(/^\/+|\/+$/g, ""),
      label: link.label,
      href: routePath(link.slug),
    }));
  const rendered = renderFixedDocument({
    skin,
    page,
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug,
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: page === "home" ? assetPath(siteConfig.assets.cover) : null,
    heading: page === "home" ? homePage.hero.heading : null,
    lead: page === "home" ? homePage.hero.lead : null,
  });
  // Keep the original Yorich header HTML and skin classes intact. The small-screen
  // toggle is React-controlled because scripts inside dangerouslySetInnerHTML do not run.
  // Only the guidebook skin needs this scoped navigation fix.
  rendered.chrome = rendered.chrome.replace(/<nav class="site-nav"[^>]*>/, '<nav class="site-nav" id="fixed-guidebook-site-nav" aria-label="Primary navigation">');
  if (skin !== "guidebook") return <div dangerouslySetInnerHTML={{ __html: rendered.chrome }} />;
  return (
    <div
      className={`fixed-guidebook-header${menuOpen ? " is-menu-open" : ""}`}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest(".site-nav a, a.brand")) setMenuOpen(false);
      }}
      onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}
    >
      <div dangerouslySetInnerHTML={{ __html: rendered.chrome }} />
      {nav.length > 0 && (
        <button
          type="button"
          className="fixed-guidebook-menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-controls="fixed-guidebook-site-nav"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((old) => !old)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          <span>Menu</span>
        </button>
      )}
    </div>
  );
}
