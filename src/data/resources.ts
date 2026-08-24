import { ResourceItem, LocationResourceAllocation } from "@/types";

export const INVENTORY_RESOURCES: ResourceItem[] = [
  {
    id: "res-boats",
    type: "boats",
    name: "Inflatable / Motorized Rescue Boats",
    totalInventory: 34,
    currentlyDeployed: 14,
    available: 20,
    unit: "Boats",
  },
  {
    id: "res-food-kits",
    type: "food_kits",
    name: "Emergency Dry Ration & Water Kits",
    totalInventory: 8500,
    currentlyDeployed: 3500,
    available: 5000,
    unit: "Kits",
  },
  {
    id: "res-medical-teams",
    type: "medical_teams",
    name: "Mobile Medical Disaster Units",
    totalInventory: 18,
    currentlyDeployed: 6,
    available: 12,
    unit: "Teams",
  },
  {
    id: "res-rescue-teams",
    type: "rescue_teams",
    name: "NDRF / SDRF Specialized Rescue Battalions",
    totalInventory: 22,
    currentlyDeployed: 7,
    available: 15,
    unit: "Teams",
  },
  {
    id: "res-vehicles",
    type: "vehicles",
    name: "High-Clearance All-Terrain Rescue Trucks",
    totalInventory: 38,
    currentlyDeployed: 13,
    available: 25,
    unit: "Vehicles",
  },
];

export const MANUAL_ALLOCATIONS: LocationResourceAllocation[] = [
  {
    districtId: "nagaon",
    locationName: "Nagaon Sadar",
    boats: 8,
    foodKits: 1500,
    medicalTeams: 3,
    rescueTeams: 2,
    vehicles: 5,
    sourceDepot: "Central Depot Guwahati",
    estimatedTransitTimeMinutes: 75,
  },
  {
    districtId: "majuli",
    locationName: "Garamur / Kamalabari",
    boats: 6,
    foodKits: 2000,
    medicalTeams: 3,
    rescueTeams: 5,
    vehicles: 8,
    sourceDepot: "Jorhat Forward Base",
    estimatedTransitTimeMinutes: 45,
  },
];
