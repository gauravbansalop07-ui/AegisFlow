AegisFlow

Human-in-the-Loop Flood Disaster Decision-Support Platform

AegisFlow is a high-fidelity Emergency Operations Center (EOC) platform
designed to help disaster-response teams understand a developing flood
situation, identify the areas where people are most at risk, optimize
limited resources, plan safer evacuations, and keep human
decision-makers in control.

Hackathon MVP: The current prototype uses deterministic simulation
logic and simulated operational data. It is designed to demonstrate
the complete decision-support workflow and is not connected to live
government emergency systems.



🚨 The Problem

During a flood, emergency teams have to make several decisions at the
same time:

Where is the situation getting worse?
Which locations need attention first?
Which communities are most vulnerable?
Where should limited rescue resources be sent?
What happens if an evacuation route becomes flooded?
Why was a particular location or response plan prioritized?
How can decisions and actions be documented for accountability?

AegisFlow brings these decisions into one operational interface instead
of treating them as separate tasks.



💡 Our Solution

AegisFlow follows a simple operational intelligence loop:

Sense → Predict → Prioritize → Act → Review

The platform combines flood simulation, impact-based prioritization,
resource optimization, evacuation routing, alerts, and human approval
into one connected workflow.

The key idea is simple:

Don't just ask where the flood is. Ask where the flood will have the
greatest human impact --- and what should be done about it.



✨ Key Features

🌊 Flood Hazard Simulation

Simulate different combinations of:
Rainfall intensity
River gauge level
Forecast horizon
Flood scenarios

The deterministic simulation updates district hazard conditions,
estimated exposure, inundation zones, river gauges, and projected hazard
trajectories.

🗺️ Exposure & Vulnerability Mapping

Visualize flood exposure alongside demographic vulnerability and
critical infrastructure.

The platform helps identify locations where flood conditions intersect
with factors such as:

Population exposure
Vulnerability
Kutcha housing
Hospitals
Critical infrastructure
Evacuation shelters

🎯 Impact-Based Risk Prioritization

AegisFlow uses a transparent impact model instead of relying only on
population size.

Impact Score = Hazard Risk × Weighted Exposure, Vulnerability &
Infrastructure Criticality

The system provides a ranked operational priority queue and explains why
a location was prioritized.

This allows a smaller but highly vulnerable settlement to receive higher
priority than a much larger but less vulnerable area.

🚑 Resource Optimization

The platform compares manual/baseline allocation with an optimized
allocation of limited emergency resources.

The prototype considers factors such as:
Impact score
Resource demand
Travel distance
Shelter capacity
Available inventory

The result is an explainable allocation recommendation rather than an
opaque decision.

🛣️ Dynamic Evacuation Routing

AegisFlow generates evacuation routes toward designated shelters while
considering road accessibility.
A road can be marked as FLOODED during the simulation.
The routing engine then recalculates the available route and provides an
explanation for the change.



Example workflow:

Safe Route → Road Flooded → Route Recalculated → Alternative Route

👤 Human-in-the-Loop Response Approval

AegisFlow does not automatically execute emergency decisions.

The system recommends a response plan, explains the reasoning, and
leaves the final decision to the incident commander.

The commander can:
Review the situation
Review recommended resources
Understand the decision rationale
Approve the response
Reject or modify the plan

Approved decisions are recorded in the operational audit trail.

🔔 Multi-Agency Intelligence Feed

The alerts module presents simulated bulletins from:

CWC
IMD
ASDMA

Alerts can be filtered by source, severity, status, and location.

The platform correlates these warnings with the simulated operational
picture.

📄 Operational Situation Reports

AegisFlow can generate an operational report containing:

Executive situation briefing
Hydro-meteorological status
Highest-risk sectors
Exposed population
Resource deployment
Active alerts
Response-plan status
Operational decision information
Reports can be viewed, printed, exported, and snapshotted.



🎬 Guided 5-Minute Demo

The application includes a guided demonstration that walks through the
complete operational story:

Unified Operational Picture
Hazard Simulation
Impact Prioritization
Resource Optimization
Access-Aware Routing
Dynamic Re-Routing
Human-in-the-Loop Approval
Situation Report
Official Intelligence
The demo drives the actual application state rather than using fake
screenshots.



🧠 How AegisFlow Works

                ┌─────────────────────┐
                │   Hazard Inputs     │
                │ Rainfall + River    │
                │ + Forecast Horizon  │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ Flood Simulation     │
                │ Hazard Propagation   │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ Exposure & Risk      │
                │ Impact Prioritization│
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ Resource Optimizer  │
                │ Limited Inventory   │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ Evacuation Routing  │
                │ Road Accessibility  │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ Human Approval      │
                │ Commander Decision  │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │ Reports + Alerts    │
                │ Accountability      │
                └─────────────────────┘



🏗️ Architecture

AegisFlow is built as a client-side decision-support prototype with
centralized reactive state.

Next.js App Router
        │
        ├── Application Shell
        │   ├── Sidebar
        │   ├── TopBar
        │   └── Simulation Bar
        │
        ├── Operational Modules
        │   ├── Overview
        │   ├── Hazard Monitor
        │   ├── Exposure Map
        │   ├── Risk Prioritization
        │   ├── Resources
        │   ├── Response Plan
        │   ├── Alerts
        │   └── Reports
        │
        ├── Central AegisFlow Context
        │
        └── Decision Engines
            ├── Flood Simulation
            ├── Risk Scoring
            ├── Resource Optimization
            └── Route Selection

The centralized context keeps the operational state synchronized across
modules.

For example:

Change rainfall
      ↓
Hazard changes
      ↓
Risk priorities change
      ↓
Resource recommendations change
      ↓
Response plan changes
      ↓
Report reflects updated situation

🛠️ Tech Stack

Technology                Purpose

Next.js                   Application framework
TypeScript                Type-safe development
Tailwind CSS              UI styling and responsive design
React                     Component-based interface
Leaflet / React-Leaflet   Interactive GIS maps
Recharts                  Operational charts and visualizations
Lucide React              Interface icons



📁 Project Structure

AegisFlow/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── hazard-monitor/
│   │   ├── exposure-map/
│   │   ├── risk-prioritization/
│   │   ├── resources/
│   │   ├── response-plan/
│   │   ├── alerts/
│   │   └── reports/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── map/
│   │   ├── charts/
│   │   ├── response/
│   │   └── demo/
│   │
│   ├── context/
│   │   └── AegisFlowContext.tsx
│   │
│   ├── data/
│   │
│   ├── lib/
│   │   ├── simulationEngine.ts
│   │   ├── scoringModel.ts
│   │   ├── resourceOptimizer.ts
│   │   └── routingEngine.ts
│   │
│   └── types/
│
├── package.json
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json



🚀 Getting Started

Prerequisites

Make sure you have Node.js and npm installed.

1. Clone the repository

git clone https://github.com/gauravbansal07-ui/AegisFlow.git
cd AegisFlow

2. Install dependencies

npm install

3. Start the development server

npm run dev

Open:

http://localhost:3000

4. Create a production build

npm run build

🎬 Recommended Demo

For the strongest demonstration:

Open the Overview dashboard.
Click START DEMO.
Follow the guided 9-step operational story.
Watch the flood scenario change.
Show the change in risk priorities.
Run resource optimization.
Demonstrate evacuation routing.
Flood a road and show automatic re-routing.
Review and approve the response plan.
Open the generated operational report.
Finish with the intelligence/alerts feed.
Exit the demo and reset the system.

🔍 Transparency & Limitations

AegisFlow is a hackathon MVP and decision-support simulation.

The current prototype uses:

Simulated rainfall
Simulated river-gauge conditions
Simulated flood propagation
Simulated exposure and vulnerability data
Simulated resource inventory
Simulated road conditions
Simulated CWC/IMD/ASDMA alert data

The prototype does not claim to provide live emergency instructions
or replace trained disaster-management authorities.

For production deployment, the architecture can be connected to
validated real-world data sources, forecasting systems, GIS datasets,
verified infrastructure information, and operational resource
inventories.



🔮 Future Scope

Potential future extensions include:

Live IMD and CWC data integration
Satellite-based flood detection
Computer vision for flood and infrastructure damage assessment
ML-assisted flood forecasting
Real-time road accessibility data
Live emergency-resource inventory
More advanced hydrological models
Historical disaster data for model validation
Multi-state / national disaster operations
Secure role-based access and audit infrastructure
The current architecture is intentionally designed so these capabilities
can be introduced without changing the core operational workflow.



🎯 Design Philosophy

AegisFlow is built around five principles:

1. Impact over raw numbers
Population size alone should not determine priority.

2. Explainability
Commanders should understand why the system recommends an action.

3. Human control
The platform recommends; authorized humans decide.

4. Operational continuity
Changes in the hazard situation should flow through prioritization,
resources, routing, and reporting.

5. Transparency
Simulation and demo data are clearly identified rather than presented as
live government data.



👥 Project

AegisFlow --- Assam Flood Decision Intelligence Platform

Built as a hackathon prototype focused on improving emergency
decision-making through connected, explainable and human-controlled
operational intelligence.



📌 Status

Hackathon MVP --- Feature Complete

The current prototype includes:

EOC dashboard
Flood simulation
Exposure mapping
Risk prioritization
Resource optimization
Dynamic evacuation routing
Human-in-the-loop approval
Multi-agency alert feed
Operational reports
Guided 5-minute demo
Responsive desktop/mobile UI