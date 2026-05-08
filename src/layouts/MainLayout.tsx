import type { ReactNode } from "react";

function MainLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}

export default MainLayout;
