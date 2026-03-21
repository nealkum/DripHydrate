import "./_group.css";
import { Button } from "@/components/ui/button";
import { Shield, Star, Users, MapPin, Stethoscope, Award } from "lucide-react";

export function WithPhoto() {
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

      {/* Hero — full bleed photo */}
      <section
        className="relative flex items-center"
        style={{ minHeight: "clamp(380px, 72vh, 92vh)", paddingTop: "56px" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/__mockup/images/drip-shoot-8241.jpeg"
            alt="Woman relaxing during in-home IV therapy session"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
        </div>

        <div className="relative w-full px-5 pt-10 pb-8">
          <div className="max-w-xs space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm">
              <Shield className="w-3 h-3" />
              Licensed RNs · Same-Day Appointments
            </div>

            <h1 className="font-['Playfair_Display'] text-3xl font-bold leading-tight text-white">
              Premium IV Therapy —{" "}
              <span style={{ color: "hsl(181 48% 43%)" }} className="italic">Delivered to You</span>
            </h1>

            <p className="text-sm text-white/75 leading-relaxed">
              Licensed nurses at your door in as little as 2 hours. 100+ cities worldwide.
            </p>

            <div className="flex flex-col gap-3 pt-1">
              <button className="w-full py-3 px-6 rounded-md font-semibold text-sm uppercase tracking-wide text-white" style={{ background: "hsl(181 48% 43%)" }}>
                Browse Treatments
              </button>
              <button className="w-full py-3 px-6 rounded-md font-semibold text-sm uppercase tracking-wide text-white border border-white/40 bg-white/5 backdrop-blur-sm">
                Become A Member
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-b border-t bg-card">
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
