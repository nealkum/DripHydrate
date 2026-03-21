import "./_group.css";
import { Shield, Star, Users, MapPin, Stethoscope, Award } from "lucide-react";

export function WithPhoto() {
  return (
    <div className="dark bg-background font-['Inter']">
      {/* Hero — full bleed photo */}
      <section
        className="relative flex items-center"
        style={{ minHeight: "clamp(380px, 72vh, 92vh)" }}
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
