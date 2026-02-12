import { Link } from "wouter";
import { Shield, Phone, Mail } from "lucide-react";
import logoPath from "@assets/drip logo_1760551470270.png";

export function Footer() {
  return (
    <footer className="border-t bg-accent/30 pt-12 pb-24" data-testid="footer">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <img src={logoPath} alt="Drip Hydration" className="h-10 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              The global leader in mobile IV therapy. Premium in-home treatments delivered by licensed registered nurses.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Treatments</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/treatments/vitamin-wellness" className="transition-colors" data-testid="link-vitamin-wellness">Vitamin & Wellness IVs</Link></li>
              <li><Link href="/treatments/nad-therapy" className="transition-colors" data-testid="link-nad-therapy">NAD+ Therapy</Link></li>
              <li><Link href="/membership" className="transition-colors" data-testid="link-membership">Membership Plans</Link></li>
              <li><Link href="/group-booking" className="transition-colors" data-testid="link-group-booking">Group Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(844) 374-7468</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@driphydration.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Trust & Safety</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>HIPAA Compliant</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Licensed RNs Only</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Physician-Directed Care</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Secure Payments</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Drip Hydration. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
