"use client";

import { usePathname } from "next/navigation";
import SimpleLayout from "./SimpleLayout";

export default function SimpleLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const showSimpleLayout = pathName !== "/login";

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-24">
      {showSimpleLayout && <SimpleLayout>{children}</SimpleLayout>}
      {!showSimpleLayout && children}
    </div>
  );
}
