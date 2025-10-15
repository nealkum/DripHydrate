import { 
  type Category, 
  type Treatment, 
  type City, 
  type Appointment,
  type InsertCategory,
  type InsertTreatment,
  type InsertCity,
  type InsertAppointment
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Treatments
  getAllTreatments(): Promise<Treatment[]>;
  getTreatmentById(id: string): Promise<Treatment | undefined>;
  getTreatmentBySlug(slug: string): Promise<Treatment | undefined>;
  getTreatmentsByCategory(categoryId: string): Promise<Treatment[]>;
  createTreatment(treatment: InsertTreatment): Promise<Treatment>;

  // Cities
  getAllCities(): Promise<City[]>;
  getCityById(id: string): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;

  // Appointments
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentById(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private treatments: Map<string, Treatment>;
  private cities: Map<string, City>;
  private appointments: Map<string, Appointment>;

  constructor() {
    this.categories = new Map();
    this.treatments = new Map();
    this.cities = new Map();
    this.appointments = new Map();
    this.seedData();
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find((c) => c.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Treatments
  async getAllTreatments(): Promise<Treatment[]> {
    return Array.from(this.treatments.values());
  }

  async getTreatmentById(id: string): Promise<Treatment | undefined> {
    return this.treatments.get(id);
  }

  async getTreatmentBySlug(slug: string): Promise<Treatment | undefined> {
    return Array.from(this.treatments.values()).find((t) => t.slug === slug);
  }

  async getTreatmentsByCategory(categoryId: string): Promise<Treatment[]> {
    return Array.from(this.treatments.values()).filter(
      (t) => t.categoryId === categoryId
    );
  }

  async createTreatment(insertTreatment: InsertTreatment): Promise<Treatment> {
    const id = randomUUID();
    const treatment: Treatment = { ...insertTreatment, id };
    this.treatments.set(id, treatment);
    return treatment;
  }

  // Cities
  async getAllCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }

  async getCityById(id: string): Promise<City | undefined> {
    return this.cities.get(id);
  }

  async createCity(insertCity: InsertCity): Promise<City> {
    const id = randomUUID();
    const city: City = { ...insertCity, id };
    this.cities.set(id, city);
    return city;
  }

  // Appointments
  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: "confirmed",
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  // Seed initial data
  private async seedData() {
    // Categories
    const vitaminWellness = await this.createCategory({
      name: "Vitamin & Wellness IVs",
      description: "Essential vitamins and hydration for energy, immunity, and recovery",
      slug: "vitamin-wellness",
    });

    const nadTherapy = await this.createCategory({
      name: "NAD+ Therapy",
      description: "Advanced anti-aging and cellular health treatments",
      slug: "nad-therapy",
    });

    // Vitamin & Wellness Treatments
    await this.createTreatment({
      categoryId: vitaminWellness.id,
      name: "Myers Cocktail Plus",
      slug: "myers-cocktail-plus",
      description: "Our most comprehensive IV therapy combining B-Complex, B12, Vitamin C, Lipostat (MIC), Magnesium, Glutathione, Biotin, and Zinc for total wellness support.",
      benefits: [
        "Boosts energy and reduces fatigue",
        "Strengthens immune system",
        "Improves skin health and appearance",
        "Supports healthy metabolism",
        "Enhances mental clarity and focus"
      ],
      duration: 45,
      price: 29900, // $299
      imageUrl: null,
    });

    await this.createTreatment({
      categoryId: vitaminWellness.id,
      name: "Immunity Boost",
      slug: "immunity-boost",
      description: "Strengthen your immune system with a powerful blend of vitamins and antioxidants designed to help your body fight off illness and recover faster.",
      benefits: [
        "Strengthens immune defense",
        "Reduces duration of illness",
        "Powerful antioxidant support",
        "Increases energy levels",
        "Promotes faster recovery"
      ],
      duration: 30,
      price: 19900, // $199
      imageUrl: null,
    });

    await this.createTreatment({
      categoryId: vitaminWellness.id,
      name: "Energy Boost",
      slug: "energy-boost",
      description: "Combat fatigue with essential energy-boosting fluids and vitamins. Perfect for busy professionals and active lifestyles.",
      benefits: [
        "Instant energy increase",
        "Reduces fatigue and exhaustion",
        "Improves mental alertness",
        "Enhances physical performance",
        "Supports metabolic function"
      ],
      duration: 30,
      price: 17900, // $179
      imageUrl: null,
    });

    await this.createTreatment({
      categoryId: vitaminWellness.id,
      name: "Hydration Package",
      slug: "hydration-package",
      description: "Rapid rehydration with IV fluids and electrolytes. Essential for recovery from dehydration, hangovers, or intense physical activity.",
      benefits: [
        "Quick rehydration",
        "Restores electrolyte balance",
        "Relieves headaches",
        "Reduces muscle cramps",
        "Improves overall recovery"
      ],
      duration: 30,
      price: 14900, // $149
      imageUrl: null,
    });

    await this.createTreatment({
      categoryId: vitaminWellness.id,
      name: "Beauty Drip",
      slug: "beauty-drip",
      description: "Fortify hair, skin, and nails while supporting collagen production. Our beauty IV delivers nutrients that promote a radiant, youthful appearance.",
      benefits: [
        "Promotes glowing skin",
        "Strengthens hair and nails",
        "Supports collagen production",
        "Reduces signs of aging",
        "Improves skin elasticity"
      ],
      duration: 45,
      price: 24900, // $249
      imageUrl: null,
    });

    await this.createTreatment({
      categoryId: vitaminWellness.id,
      name: "The Hangover IV",
      slug: "hangover-iv",
      description: "Fast relief from hangover symptoms including nausea, headaches, and fatigue. Get back to feeling your best quickly.",
      benefits: [
        "Relieves nausea and headaches",
        "Rapid rehydration",
        "Restores essential nutrients",
        "Increases energy levels",
        "Detoxifies the body"
      ],
      duration: 30,
      price: 17900, // $179
      imageUrl: null,
    });

    await this.createTreatment({
      categoryId: vitaminWellness.id,
      name: "Recovery & Performance",
      slug: "recovery-performance",
      description: "Improve athletic endurance, shorten muscle recovery time, and enhance overall performance with targeted nutrients for active individuals.",
      benefits: [
        "Speeds muscle recovery",
        "Reduces inflammation",
        "Enhances athletic performance",
        "Improves endurance",
        "Supports joint health"
      ],
      duration: 45,
      price: 22900, // $229
      imageUrl: null,
    });

    await this.createTreatment({
      categoryId: vitaminWellness.id,
      name: "Migraine Relief",
      slug: "migraine-relief",
      description: "Fast-acting relief for migraine headaches and associated symptoms. Our specialized formula targets pain and nausea.",
      benefits: [
        "Rapid headache relief",
        "Reduces nausea",
        "Decreases light sensitivity",
        "Promotes relaxation",
        "Prevents recurring migraines"
      ],
      duration: 30,
      price: 19900, // $199
      imageUrl: null,
    });

    // NAD+ Treatments
    await this.createTreatment({
      categoryId: nadTherapy.id,
      name: "NAD+ IV Therapy",
      slug: "nad-iv-therapy",
      description: "Advanced anti-aging therapy that supports brain function, increases energy, and aids in addiction recovery. NAD+ is essential for cellular health and longevity.",
      benefits: [
        "Enhances cognitive function",
        "Boosts cellular energy",
        "Supports anti-aging",
        "Improves mental clarity",
        "Aids in addiction recovery"
      ],
      duration: 120,
      price: 59900, // $599
      imageUrl: null,
    });

    await this.createTreatment({
      categoryId: nadTherapy.id,
      name: "NAD+ Boost",
      slug: "nad-boost",
      description: "High-dose NAD+ combined with vitamin boost for maximum energy and anti-aging benefits. Perfect for those seeking peak performance.",
      benefits: [
        "Maximum cellular energy",
        "Enhanced mental performance",
        "Powerful anti-aging effects",
        "Improved metabolism",
        "Increased vitality"
      ],
      duration: 150,
      price: 79900, // $799
      imageUrl: null,
    });

    // Cities - Major US cities across different regions
    const cities = [
      // West Coast
      { name: "Los Angeles", state: "CA", region: "West Coast" },
      { name: "San Francisco", state: "CA", region: "West Coast" },
      { name: "San Diego", state: "CA", region: "West Coast" },
      { name: "Seattle", state: "WA", region: "West Coast" },
      { name: "Portland", state: "OR", region: "West Coast" },
      { name: "Las Vegas", state: "NV", region: "West Coast" },
      
      // Southwest
      { name: "Phoenix", state: "AZ", region: "Southwest" },
      { name: "Scottsdale", state: "AZ", region: "Southwest" },
      { name: "Denver", state: "CO", region: "Southwest" },
      { name: "Austin", state: "TX", region: "Southwest" },
      { name: "Dallas", state: "TX", region: "Southwest" },
      { name: "Houston", state: "TX", region: "Southwest" },
      { name: "San Antonio", state: "TX", region: "Southwest" },
      
      // Midwest
      { name: "Chicago", state: "IL", region: "Midwest" },
      { name: "Minneapolis", state: "MN", region: "Midwest" },
      { name: "Detroit", state: "MI", region: "Midwest" },
      { name: "Kansas City", state: "MO", region: "Midwest" },
      { name: "St. Louis", state: "MO", region: "Midwest" },
      
      // Southeast
      { name: "Miami", state: "FL", region: "Southeast" },
      { name: "Orlando", state: "FL", region: "Southeast" },
      { name: "Tampa", state: "FL", region: "Southeast" },
      { name: "Atlanta", state: "GA", region: "Southeast" },
      { name: "Nashville", state: "TN", region: "Southeast" },
      { name: "Charlotte", state: "NC", region: "Southeast" },
      { name: "New Orleans", state: "LA", region: "Southeast" },
      
      // Northeast
      { name: "New York", state: "NY", region: "Northeast" },
      { name: "Boston", state: "MA", region: "Northeast" },
      { name: "Philadelphia", state: "PA", region: "Northeast" },
      { name: "Washington", state: "DC", region: "Northeast" },
      { name: "Baltimore", state: "MD", region: "Northeast" },
    ];

    for (const city of cities) {
      await this.createCity({
        ...city,
        country: "USA",
      });
    }
  }
}

export const storage = new MemStorage();
