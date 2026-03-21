import "./_group.css";
import { Star, Users, MapPin, Stethoscope, Award } from "lucide-react";

export function NoPhoto() {
  return (
    <div className="dark min-h-screen bg-background font-['Inter']">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
          <span className="font-bold text-xs tracking-widest uppercase text-foreground">Drip Hydration</span>
        </div>
        <div className="w-5 h-5 flex flex-col gap-1 justify-center">
          <div className="h-0.5 bg-foreground/70 rounded" />
          <div className="h-0.5 bg-foreground/70 rounded" />
          <div className="h-0.5 bg-foreground/70 rounded" />
        </div>
      </header>

      {/* Hero — plain dark background, centered */}
      <section className="relative py-16" style={{ paddingTop: "calc(56px + 4rem)" }}>
        <div className="px-5">
          <div className="text-center max-w-sm mx-auto space-y-5">
            <h1 className="font-['Playfair_Display'] text-3xl font-bold leading-tight text-foreground">
              Premium IV Therapy —{" "}
              <span style={{ color: "hsl(181 48% 43%)" }} className="italic">Delivered to You</span>
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Licensed nurses at your door in as little as 2 hours. 100+ cities worldwide.
            </p>

            <div className="flex flex-col gap-3 pt-1">
              <button className="w-full py-3 px-6 rounded-md font-semibold text-sm uppercase tracking-wide text-white" style={{ background: "hsl(181 48% 43%)" }}>
                Browse Treatments
              </button>
              <button className="w-full py-3 px-6 rounded-md font-semibold text-sm uppercase tracking-wide text-foreground border border-border bg-transparent">
                Become A Member
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-b border-t bg-card mt-2">
        <div className="px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-foreground ml-1">4.9</span>
              <span>rating</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" style={{ color: "hsl(181 48% 43%)" }} />
              <span><span className="font-semibold text-foreground">100,000+</span> treatments</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" style={{ color: "hsl(181 48% 43%)" }} />
              <span><span className="font-semibold text-foreground">100+</span> cities</span>
            </div>
            <div className="flex items-center gap-1">
              <Stethoscope className="w-3 h-3" style={{ color: "hsl(181 48% 43%)" }} />
              <span><span className="font-semibold text-foreground">Doctor-Owned</span> &amp; Directed</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" style={{ color: "hsl(181 48% 43%)" }} />
              <span>Celebrating <span className="font-semibold text-foreground">10 Years</span></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
