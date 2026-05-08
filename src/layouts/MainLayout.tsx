import type { ReactNode } from "react";

function MainLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-dark-900 pt-6 pb-20">{children}</main>;
}

export default MainLayout;
