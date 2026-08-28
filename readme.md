AegisFlow

Human-in-the-Loop Emergency Decision Support

AegisFlow is an emergency operations platform that helps response teams turn changing flood conditions into clear, explainable actions. It brings hazard intelligence, impact prioritization, resource allocation, evacuation routing, alerts, and operational reporting into one unified system.

What it does

Sense — Monitor rainfall, river conditions, incidents, exposure, and alerts.

Predict — Simulate how changing hazard conditions can affect districts and populations.

Prioritize — Rank locations using hazard, exposure, demographic vulnerability, and infrastructure criticality.

Act — Optimize limited emergency resources and generate access-aware evacuation routes.

Approve — Keep the incident commander in control with transparent recommendations and explicit response approval.

Learn — Capture operational decisions, alerts, and response state in structured reports.

Core Capabilities

🌊 Flood Simulation — Scenario-based hazard and inundation forecasting.

🎯 Impact Prioritization — Explainable risk scoring and priority queues.

🚑 Resource Optimization — Allocation recommendations based on impact, demand, distance, and capacity.

🛣️ Dynamic Routing — Recalculate evacuation routes when roads become inaccessible.

👤 Human-in-the-Loop — Review, approve, reject, and audit response plans.

🔔 Operational Alerts — Centralized multi-agency warning and alert feed.

📊 Situation Reports — Generate structured operational briefings and decision records.

🗺️ GIS Operations View — Interactive maps for hazards, districts, shelters, resources, and routes.

Decision Flow

Hazard Conditions
       ↓
Flood Simulation
       ↓
Exposure & Impact
       ↓
Risk Prioritization
       ↓
Resource Optimization
       ↓
Evacuation Routing
       ↓
Human Approval
       ↓
Operational Report

A change in the simulated hazard state propagates through the decision pipeline, keeping the operational picture synchronized across modules.

Architecture

Next.js + TypeScript
        │
        ├── EOC Application Shell
        ├── Centralized Operational State
        ├── GIS & Visualization Layer
        │
        └── Decision Engines
            ├── Flood Simulation
            ├── Risk Scoring
            ├── Resource Optimization
            └── Route Selection

Technology

Next.js

React

TypeScript

Tailwind CSS

Leaflet / React-Leaflet

Recharts

Lucide React

Getting Started

git clone https://github.com/gauravbansal07-ui/AegisFlow.git
cd AegisFlow
npm install
npm run dev

Open http://localhost:3000.

For a production build:

npm run build

Data & Operational Scope

The current system uses deterministic models and simulated operational inputs for hazard, exposure, resources, road conditions, and alerts. These inputs are clearly identified within the application.

The platform is designed as decision support: it provides explainable recommendations while keeping final operational authority with designated human responders.

Roadmap

AegisFlow can be extended with validated live data feeds, satellite-based flood detection, advanced hydrological forecasting, real-time infrastructure and road status, historical disaster datasets, and secure multi-agency operational infrastructure.

AegisFlow — From changing conditions to accountable decisions.