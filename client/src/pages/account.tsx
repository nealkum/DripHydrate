import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  User, Package, Star, Gift, LogOut, Copy, Check, ArrowRight,
  Calendar, MapPin, RotateCcw, ChevronRight, Truck, Award, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shippedToYouSlugs } from "@/lib/treatment-data";

interface DripAccount {
  name: string;
  email: string;
  points: number;
  referralCode: string;
  joinedDate: string;
}

interface MockOrder {
  id: string;
  treatmentName: string;
  treatmentSlug: string;
  date: string;
  time?: string;
  address: string;
  price: number;
  status: "completed" | "upcoming" | "shipped";
  isShipped: boolean;
  pointsEarned: number;
}

interface LoyaltyHistoryItem {
  date: string;
  description: string;
  points: number;
  type: "earn" | "redeem";
}

const LOYALTY_TIERS = [
  { name: "Bronze",   min: 0,    max: 999,   color: "text-amber-600",  bg: "bg-amber-100 dark:bg-amber-900/30"  },
  { name: "Silver",   min: 1000, max: 2499,  color: "text-slate-400",  bg: "bg-slate-100 dark:bg-slate-800/60"  },
  { name: "Gold",     min: 2500, max: 4999,  color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30"},
  { name: "Platinum", min: 5000, max: 99999, color: "text-primary",    bg: "bg-primary/10"                      },
];

const REDEMPTION_TIERS = [
  { points: 500,  reward: "$25 off your next booking" },
  { points: 1000, reward: "$55 off — free add-on booster" },
  { points: 2500, reward: "$150 off — one free session" },
  { points: 5000, reward: "$350 off — free monthly membership" },
];

const MOCK_ORDERS: MockOrder[] = [
  {
    id: "APT-9821",
    treatmentName: "Myers' Cocktail",
    treatmentSlug: "myers-cocktail",
    date: "2026-03-10",
    time: "Morning (9 AM–12 PM)",
    address: "142 Wilshire Blvd, Los Angeles",
    price: 27900,
    status: "completed",
    isShipped: false,
    pointsEarned: 279,
  },
  {
    id: "APT-9744",
    treatmentName: "NAD+ IV Therapy",
    treatmentSlug: "nad-iv-therapy",
    date: "2026-02-22",
    time: "2:00 PM",
    address: "142 Wilshire Blvd, Los Angeles",
    price: 89900,
    status: "completed",
    isShipped: false,
    pointsEarned: 899,
  },
  {
    id: "ORD-3312",
    treatmentName: "Vitamin B-12 Injections",
    treatmentSlug: "vitamin-b-12-injections",
    date: "2026-02-05",
    address: "142 Wilshire Blvd, Los Angeles",
    price: 3500,
    status: "shipped",
    isShipped: true,
    pointsEarned: 35,
  },
  {
    id: "APT-9601",
    treatmentName: "Immunity Defense",
    treatmentSlug: "immunity-defense",
    date: "2026-01-18",
    time: "10:00 AM",
    address: "142 Wilshire Blvd, Los Angeles",
    price: 24900,
    status: "completed",
    isShipped: false,
    pointsEarned: 249,
  },
];

const MOCK_LOYALTY_HISTORY: LoyaltyHistoryItem[] = [
  { date: "Mar 10, 2026", description: "Myers' Cocktail booking",    points: 279,  type: "earn"   },
  { date: "Feb 22, 2026", description: "NAD+ IV Therapy booking",    points: 899,  type: "earn"   },
  { date: "Feb 15, 2026", description: "Referral bonus — 1 friend",  points: 250,  type: "earn"   },
  { date: "Feb 05, 2026", description: "B-12 Injections order",      points: 35,   type: "earn"   },
  { date: "Jan 31, 2026", description: "Redeemed: $25 off booking",  points: -500, type: "redeem" },
  { date: "Jan 18, 2026", description: "Immunity Defense booking",   points: 249,  type: "earn"   },
  { date: "Jan 05, 2026", description: "Welcome bonus",              points: 100,  type: "earn"   },
];

const MOCK_REFERRALS = [
  { name: "Sarah M.", joined: "Feb 15, 2026", status: "Booked",  credit: 25 },
  { name: "James T.", joined: "Jan 28, 2026", status: "Booked",  credit: 25 },
  { name: "Priya K.", joined: "Mar 02, 2026", status: "Pending", credit: 0  },
];

function getTier(points: number) {
  return LOYALTY_TIERS.find(t => points >= t.min && points <= t.max) ?? LOYALTY_TIERS[0];
}

function getNextTier(points: number) {
  const idx = LOYALTY_TIERS.findIndex(t => points >= t.min && points <= t.max);
  return LOYALTY_TIERS[idx + 1] ?? null;
}

export default function Account() {
  const [, setNavLocation] = useLocation();
  const { toast } = useToast();

  const [account, setAccount] = useState<DripAccount | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "loyalty" | "referrals">("orders");

  const [loginForm, setLoginForm] = useState({ email: "", password: "", name: "" });
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("dripAccount");
    if (stored) {
      try { setAccount(JSON.parse(stored)); } catch {}
    }
  }, []);

  const saveAccount = (acc: DripAccount) => {
    sessionStorage.setItem("dripAccount", JSON.stringify(acc));
    setAccount(acc);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginForm.email.includes("@")) {
      setLoginError("Please enter a valid email address.");
      return;
    }
    if (loginForm.password.length < 6) {
      setLoginError("Password must be at least 6 characters.");
      return;
    }
    const prefix = loginForm.email.split("@")[0].toUpperCase().slice(0, 6).replace(/[^A-Z0-9]/g, "X");
    const acc: DripAccount = {
      name: isSignUp ? loginForm.name || loginForm.email.split("@")[0] : loginForm.email.split("@")[0],
      email: loginForm.email,
      points: isSignUp ? 100 : 1312,
      referralCode: `DRIP-${prefix}`,
      joinedDate: isSignUp ? new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "January 2026",
    };
    saveAccount(acc);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dripAccount");
    setAccount(null);
    setLoginForm({ email: "", password: "", name: "" });
  };

  const copyReferralCode = () => {
    if (!account) return;
    navigator.clipboard.writeText(account.referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Your referral code has been copied to clipboard." });
  };

  const handleRebook = (order: MockOrder) => {
    setNavLocation(`/book/${order.treatmentSlug}/location`);
  };

  if (!account) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignUp
                ? "Join Drip Hydration to track orders, earn rewards, and refer friends."
                : "Sign in to view your orders, loyalty points, and referral rewards."}
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      value={loginForm.name}
                      onChange={e => setLoginForm(p => ({ ...p, name: e.target.value }))}
                      data-testid="input-name"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    data-testid="input-password"
                  />
                </div>
                {loginError && (
                  <p className="text-sm text-destructive" data-testid="text-login-error">{loginError}</p>
                )}
                <Button type="submit" className="w-full font-semibold uppercase" data-testid="button-login">
                  {isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>

              <Separator className="my-5" />

              <p className="text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "New to Drip Hydration?"}{" "}
                <button
                  type="button"
                  className="text-primary font-semibold hover:underline"
                  onClick={() => { setIsSignUp(!isSignUp); setLoginError(""); }}
                  data-testid="button-toggle-auth"
                >
                  {isSignUp ? "Sign In" : "Create Account"}
                </button>
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            New members receive 100 bonus loyalty points on sign-up.
          </p>
        </div>
      </div>
    );
  }

  const tier = getTier(account.points);
  const nextTier = getNextTier(account.points);
  const progressToNext = nextTier
    ? Math.round(((account.points - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100;

  const tabs = [
    { id: "orders"   as const, label: "Orders",    icon: Package },
    { id: "loyalty"  as const, label: "Loyalty",   icon: Star    },
    { id: "referrals"as const, label: "Referrals", icon: Gift    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Profile header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-primary">
                {account.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">{account.name}</h1>
              <p className="text-sm text-muted-foreground">{account.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs font-semibold no-default-hover-elevate no-default-active-elevate ${tier.bg} ${tier.color} border-0`}>
                  <Award className="w-3 h-3 mr-1" />
                  {tier.name} Member
                </Badge>
                <span className="text-xs text-muted-foreground">since {account.joinedDate}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground" data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Points snapshot */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Loyalty Points</p>
              <p className="text-3xl font-bold text-primary" data-testid="text-points-balance">{account.points.toLocaleString()} pts</p>
              {nextTier && (
                <p className="text-xs text-muted-foreground mt-1">
                  {(nextTier.min - account.points).toLocaleString()} pts to {nextTier.name}
                </p>
              )}
            </div>
            <div className="flex-1 min-w-[140px] max-w-[240px]">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>{tier.name}</span>
                {nextTier && <span>{nextTier.name}</span>}
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
            <Button size="sm" className="font-semibold uppercase text-xs" asChild>
              <Link href="#loyalty" onClick={() => setActiveTab("loyalty")}>
                View Rewards <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── ORDERS TAB ─────────────────────────────────────────────────── */}
        {activeTab === "orders" && (
          <div className="space-y-4" data-testid="section-orders">
            {MOCK_ORDERS.map(order => (
              <Card key={order.id} data-testid={`card-order-${order.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        order.isShipped ? "bg-blue-500/10" : "bg-primary/10"
                      }`}>
                        {order.isShipped
                          ? <Truck className="w-5 h-5 text-blue-500" />
                          : <Calendar className="w-5 h-5 text-primary" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm" data-testid={`text-order-treatment-${order.id}`}>
                          {order.treatmentName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {order.time && ` · ${order.time}`}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{order.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-xs no-default-hover-elevate no-default-active-elevate ${
                            order.status === "completed" ? "bg-green-500/10 text-green-600 border-0" :
                            order.status === "shipped"   ? "bg-blue-500/10 text-blue-500 border-0" :
                                                          "bg-primary/10 text-primary border-0"
                          }`}
                        >
                          {order.status === "completed" ? "Completed" : order.status === "shipped" ? "Shipped" : "Upcoming"}
                        </Badge>
                        <span className="text-sm font-semibold text-foreground">
                          ${(order.price / 100).toFixed(0)}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-medium">+{order.pointsEarned} pts earned</p>
                      {!order.isShipped && order.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs font-semibold uppercase"
                          onClick={() => handleRebook(order)}
                          data-testid={`button-rebook-${order.id}`}
                        >
                          <RotateCcw className="w-3 h-3 mr-1.5" />
                          Rebook
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="p-5 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Ready for your next session?</p>
                <Button size="sm" className="font-semibold uppercase text-xs" asChild>
                  <Link href="/treatments">Book Now <ArrowRight className="w-3 h-3 ml-1.5" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── LOYALTY TAB ────────────────────────────────────────────────── */}
        {activeTab === "loyalty" && (
          <div className="space-y-6" data-testid="section-loyalty">

            {/* Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Membership Tiers</CardTitle>
                <CardDescription>Earn 1 point for every $1 spent on treatments and orders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {LOYALTY_TIERS.map(t => {
                  const isCurrentTier = t.name === tier.name;
                  return (
                    <div
                      key={t.name}
                      className={`flex items-center justify-between p-3 rounded-md ${isCurrentTier ? `${t.bg} border border-current/20` : "bg-muted/30"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Award className={`w-5 h-5 ${isCurrentTier ? t.color : "text-muted-foreground"}`} />
                        <div>
                          <p className={`font-semibold text-sm ${isCurrentTier ? t.color : "text-muted-foreground"}`}>
                            {t.name}
                            {isCurrentTier && <span className="ml-2 text-xs font-normal opacity-75">← You are here</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.max === 99999 ? `${t.min.toLocaleString()}+ pts` : `${t.min.toLocaleString()}–${t.max.toLocaleString()} pts`}
                          </p>
                        </div>
                      </div>
                      {isCurrentTier && (
                        <Badge className={`text-xs no-default-hover-elevate no-default-active-elevate ${t.bg} ${t.color} border-0`}>
                          Current
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Redemption options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Redeem Points</CardTitle>
                <CardDescription>You have <span className="text-primary font-semibold">{account.points.toLocaleString()} pts</span> available to redeem.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {REDEMPTION_TIERS.map(r => {
                  const canRedeem = account.points >= r.points;
                  return (
                    <div
                      key={r.points}
                      className={`flex items-center justify-between p-4 rounded-md border ${canRedeem ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30 opacity-60"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Zap className={`w-4 h-4 flex-shrink-0 ${canRedeem ? "text-primary" : "text-muted-foreground"}`} />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{r.reward}</p>
                          <p className="text-xs text-muted-foreground">{r.points.toLocaleString()} points</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={canRedeem ? "default" : "outline"}
                        disabled={!canRedeem}
                        className="text-xs font-semibold uppercase flex-shrink-0"
                        data-testid={`button-redeem-${r.points}`}
                      >
                        Redeem
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Points history */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Points History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {MOCK_LOYALTY_HISTORY.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <p className="text-foreground font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                      </div>
                      <span className={`font-semibold flex-shrink-0 ml-4 ${item.type === "earn" ? "text-green-500" : "text-muted-foreground"}`}>
                        {item.type === "earn" ? "+" : ""}{item.points.toLocaleString()} pts
                      </span>
                    </div>
                    {idx < MOCK_LOYALTY_HISTORY.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── REFERRALS TAB ──────────────────────────────────────────────── */}
        {activeTab === "referrals" && (
          <div className="space-y-6" data-testid="section-referrals">

            {/* How it works */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif text-xl font-bold text-foreground">Give $25, Get $25</h3>
                <p className="text-sm text-muted-foreground">
                  Share your unique referral code with friends. When they complete their first booking, they get $25 off — and you earn $25 in credit plus 250 loyalty points.
                </p>
                <div className="grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
                  {[
                    { step: "1", label: "Share your code" },
                    { step: "2", label: "Friend books a session" },
                    { step: "3", label: "You both get $25" },
                  ].map(s => (
                    <div key={s.step} className="space-y-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center mx-auto">
                        {s.step}
                      </div>
                      <p>{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Referral code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Referral Code</CardTitle>
                <CardDescription>Share this code or link with friends and family.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-md border bg-muted/50 px-4 py-3 font-mono text-lg font-bold tracking-widest text-foreground select-all" data-testid="text-referral-code">
                    {account.referralCode}
                  </div>
                  <Button
                    size="default"
                    variant="outline"
                    onClick={copyReferralCode}
                    className="font-semibold uppercase flex-shrink-0"
                    data-testid="button-copy-code"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Or share this link:{" "}
                  <span className="text-primary font-medium">driphydration.com/book?ref={account.referralCode}</span>
                </p>
              </CardContent>
            </Card>

            {/* Referral stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Referrals Sent",   value: MOCK_REFERRALS.length },
                { label: "Completed",         value: MOCK_REFERRALS.filter(r => r.status === "Booked").length },
                { label: "Credit Earned",     value: `$${MOCK_REFERRALS.reduce((s, r) => s + r.credit, 0)}` },
              ].map(stat => (
                <Card key={stat.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Referral list */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Referrals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {MOCK_REFERRALS.map((r, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{r.name}</p>
                          <p className="text-xs text-muted-foreground">Joined {r.joined}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <Badge className={`text-xs no-default-hover-elevate no-default-active-elevate ${
                          r.status === "Booked"
                            ? "bg-green-500/10 text-green-600 border-0"
                            : "bg-muted text-muted-foreground border-0"
                        }`}>
                          {r.status}
                        </Badge>
                        {r.credit > 0 && (
                          <p className="text-xs text-primary font-semibold mt-1">+${r.credit} credit</p>
                        )}
                      </div>
                    </div>
                    {idx < MOCK_REFERRALS.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
