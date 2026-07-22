# SnowRetail · Live Customer Intelligence

An agentic, end-to-end retail operations demo built on Snowflake. One platform. Five operating domains. 22+ scenarios (growing to 60+). Semantic Layer as the connective tissue throughout.

**Live demo:** (deploy to GitHub Pages after pushing to `main`)

## Why this exists

Retail leaders are being asked to show — not pitch — what an agentic operating model looks like across customer intelligence, omnichannel, commerce, supply chain, and marketing. SnowRetail is that demo. It runs in a browser, in five minutes, with no live data dependency, and it stays inside the regulatory rails a Chile/LATAM retailer actually has to live with: SERNAC, Ley 19.496, Ley 21.096, PCI-DSS, CMF, ISO 27001.

Behind every scenario is a believable Snowflake architecture: **Semantic Views** · Cortex Analyst · Cortex Agents · Cortex Complete · AISQL · Snowpark ML · ML Registry · Snowpark Container Services · Snowpipe Streaming · Dynamic Tables · Time Travel · Horizon Catalog.

## The Semantic Layer Story

The demo emphasizes three key messages about Snowflake's Semantic Layer:

1. **One Definition, Many Consumers** — Each metric is defined once in a Semantic View. That definition is consumed by dashboards, Cortex Agents, natural-language queries, and compliance evidence packs.

2. **Natural Language as the Interface** — Every domain has an "Ask this domain" panel showing Cortex Analyst in action. Store leaders with zero SQL get the same governed answer a data engineer would produce.

3. **Governed by Design** — Row-level security, column masking, and VQR accuracy guarantees are embedded in the Semantic View, not bolted on after.

## What an executive sees in 5 minutes

| Domain | Scenario | Outcome |
|--------|----------|---------|
| CIC · Customer Intelligence | High-value churn save | 89 P1 customers saved · $420K CLV protected |
| OMN · Omnichannel | Planogram Intelligence | AI-driven aisle placement · +19% SKU sales lift |
| COM · Commerce & Revenue | Revenue leakage detection | $2.4M/year leakage closed |
| SCO · Supply Chain | Supplier lateness correlation | $940K revenue protected |
| MKT · Marketing & Growth | True ROAS attribution | 4.5x loyalty email ROAS · $1.8M budget savings |

## Semantic Layer Architecture

```
Sources (POS, eComm, Inventory, CRM, Logistics)
    ↓ Snowpipe Streaming + Iceberg Tables (S3/Glue)
Bronze → Silver → Gold (Dynamic Tables, always fresh)
    ↓
┌─────────────────────────────────────────────┐
│         SEMANTIC LAYER (5 Views)            │
│  66 metrics · 44 dimensions · 66 VQRs      │
│  Governed · Row-level security · Masking    │
└─────────────────────────────────────────────┘
    ↓ One truth, many consumers
Cortex Agent | Cortex Analyst | Dashboards | Store Tablet | Compliance
```

## Running it

```bash
git clone https://github.com/<your-org>/SnowRetail-Live-Customer-Intelligence.git
cd SnowRetail-Live-Customer-Intelligence
npm install
npm run dev    # http://localhost:5173/SnowRetail-Live-Customer-Intelligence/
```

## Production build

```bash
npm run build
npm run preview
```

## Stack

React 18 · Vite 5 · TypeScript · Tailwind CSS v4 · framer-motion · ECharts · React Router v6 · Lucide Icons

## Deployment

Auto-deploys to GitHub Pages on every push to `main` via `.github/workflows/pages.yml`.

## Live Snowflake Integration (Optional)

When connected to a Snowflake account, certain "Semantic Hero" scenarios can fire real natural-language queries through Cortex Analyst against actual Semantic Views. The demo gracefully falls back to synthetic responses when offline.

## Compliance Surface (Chile/LATAM)

| Regulation | Scope |
|---|---|
| SERNAC / Ley 19.496 | Consumer protection |
| Ley 21.096 | Personal data protection |
| PCI-DSS | Payment card security |
| CMF | Financial credit regulations |
| Ley 20.169 | Fair competition |
| Ley 21.234 | eCommerce right to withdrawal |
| ISO 27001 / SOC 2 | Information security |

## Disclaimer

SnowRetail is a fictional retail operation created to illustrate the art of the possible with Snowflake's data + AI platform. All numbers, customers, stores, and regulatory artefacts are synthetic. $-value sizing in any real engagement is customer-specific.
