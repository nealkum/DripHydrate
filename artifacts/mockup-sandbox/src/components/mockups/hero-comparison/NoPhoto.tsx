import "./_group.css";
import { Star, Users, MapPin, Stethoscope, Award } from "lucide-react";

export function NoPhoto() {
  return (
    <div className="dark bg-background font-['Inter']">
      {/* Hero — plain dark background, centered */}
      <section className="relative py-16">
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
