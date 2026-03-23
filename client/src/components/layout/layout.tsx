import { Header } from "./header";
import { Footer } from "@/components/footer";
import { StickyCTABar } from "@/components/sticky-cta-bar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-[132px] md:pb-[64px]">
        {children}
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  );
}
