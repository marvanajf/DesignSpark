export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const industries: Industry[] = [
  {
    id: "technology",
    name: "Technology",
    description: "Software, IT services, hardware, cloud computing, and digital infrastructure",
    icon: "Laptop"
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical services, pharmaceuticals, health technology, and wellness",
    icon: "Heart"
  },
  {
    id: "finance",
    name: "Finance",
    description: "Banking, insurance, investment management, and financial services",
    icon: "Banknote"
  },
  {
    id: "education",
    name: "Education",
    description: "Educational institutions, e-learning platforms, and training services",
    icon: "GraduationCap"
  },
  {
    id: "retail",
    name: "Retail",
    description: "E-commerce, retail chains, consumer products, and distribution",
    icon: "ShoppingBag"
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description: "Production, supply chain, industrial goods, and manufacturing processes",
    icon: "Factory"
  },
  {
    id: "realestate",
    name: "Real Estate",
    description: "Property management, development, construction, and real estate services",
    icon: "Home"
  },
  {
    id: "hospitality",
    name: "Hospitality",
    description: "Hotels, restaurants, travel services, and entertainment",
    icon: "Utensils"
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Advertising agencies, market research, PR firms, and digital marketing",
    icon: "BarChart"
  },
  {
    id: "legal",
    name: "Legal",
    description: "Law firms, legal services, compliance, and regulatory affairs",
    icon: "Scale"
  },
  {
    id: "nonprofits",
    name: "Non-Profits",
    description: "Charitable organizations, foundations, and social enterprises",
    icon: "Heart"
  },
  {
    id: "energy",
    name: "Energy",
    description: "Oil and gas, renewable energy, utilities, and energy infrastructure",
    icon: "Zap"
  }
];