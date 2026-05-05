"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  AppShell,
  SiteFooter,
  SiteHeader
} from "./BooklyUi";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isReaderRoute = pathname.startsWith("/read");

  if (isReaderRoute) {
    return <>{ children }</>;
  }

  return (
    <AppShell>
      <SiteHeader />
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        { children }
      </div>
      <SiteFooter />
    </AppShell>
  );
}
