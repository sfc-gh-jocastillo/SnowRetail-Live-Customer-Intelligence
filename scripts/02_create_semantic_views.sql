/*
=============================================================================
 SNOWRETAIL - LIVE CUSTOMER INTELLIGENCE
 Script 02: Semantic Views
 
 Creates 5 Semantic Views (one per domain) on top of the gold tables.
 These are the governed metric definitions that power Cortex Analyst queries.
=============================================================================
*/

USE SCHEMA SNOWRETAIL.SEMANTIC;

-- ============================================================================
-- SEMANTIC VIEW 1: SV_CUSTOMER_INTELLIGENCE (CIC Domain)
-- ============================================================================
CREATE OR REPLACE SEMANTIC VIEW SNOWRETAIL.SEMANTIC.SV_CUSTOMER_INTELLIGENCE
  AS SELECT * FROM SNOWRETAIL.GOLD.CUSTOMER_360
  COMMENT = 'Customer Intelligence semantic view — CLV, churn, NPS, cross-sell metrics for identity-resolved customer 360.'
  WITH SEMANTICS (
    METRICS = (
      'CLV' COMMENT 'Customer Lifetime Value — 12-month predicted revenue from this customer.',
      'CHURN_PROBABILITY' COMMENT 'Probability (0-1) that this customer will churn within 30 days. ML-scored weekly.',
      'NPS_SCORE' COMMENT 'Net Promoter Score from last survey response. Range -100 to 100.',
      'CROSS_SELL_PROPENSITY' COMMENT 'Probability (0-1) of purchasing from a new category within 30 days.',
      'DAYS_SINCE_LAST_PURCHASE' COMMENT 'Calendar days since last transaction across any channel.',
      'PURCHASES_12M' COMMENT 'Total number of purchases in the last 12 months.',
      'REVENUE_12M' COMMENT 'Total revenue generated in the last 12 months.',
      'AVG_BASKET_SIZE' COMMENT 'Average transaction amount across all purchases.',
      'CHURN_RATE' COMMENT 'Aggregated churn rate for this customer region/segment combination. Updated monthly.',
      'MOM_CHANGE' COMMENT 'Month-over-month change in churn rate for this segment. Positive = worsening.'
    ),
    DIMENSIONS = (
      'SEGMENT' COMMENT 'Customer value segment: VIP, PREMIUM, REGULAR, NEW, LAPSED.',
      'LOYALTY_TIER' COMMENT 'Loyalty program tier: PLATINUM, GOLD, SILVER, BRONZE, NONE.',
      'AGE_RANGE' COMMENT 'Age band: 18-25, 26-35, 36-45, 46-55, 56+.',
      'REGION' COMMENT 'Geographic region: Metropolitana, Valparaiso, Biobio, Sur, Norte, Austral.',
      'CITY' COMMENT 'City of residence.',
      'PREFERRED_CHANNEL' COMMENT 'Customer preferred shopping channel: STORE, WEB, APP.',
      'GENDER' COMMENT 'Customer gender.',
      'HAS_CARD' COMMENT 'Whether customer holds a Ripley Card.'
    )
  );

-- ============================================================================
-- SEMANTIC VIEW 2: SV_OMNICHANNEL_OPS (OMN Domain)
-- ============================================================================
CREATE OR REPLACE SEMANTIC VIEW SNOWRETAIL.SEMANTIC.SV_OMNICHANNEL_OPS
  AS SELECT * FROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT
  COMMENT = 'Omnichannel Operations semantic view — foot traffic, conversion, planogram compliance for store optimization.'
  WITH SEMANTICS (
    METRICS = (
      'FOOT_TRAFFIC' COMMENT 'Weekly visitor count to this aisle/section. From in-store sensors.',
      'CONVERSION_RATE' COMMENT 'Ratio of purchases to visitors in this aisle. Formula: transactions / foot_traffic.',
      'REVENUE_PER_SQFT' COMMENT 'Weekly revenue generated per square foot in this aisle section.',
      'COMPLIANCE_SCORE' COMMENT 'Planogram compliance percentage (0-100). Based on image recognition verification.'
    ),
    DIMENSIONS = (
      'STORE_ID' COMMENT 'Unique store identifier.',
      'STORE_NAME' COMMENT 'Human-readable store name.',
      'AISLE' COMMENT 'Aisle identifier within the store.',
      'SECTION' COMMENT 'Product section within the aisle: Electronics, Home & Garden, Fashion, Sports, Beauty, Kids.',
      'CATEGORY' COMMENT 'Product category.',
      'SHELF_POSITION' COMMENT 'Vertical shelf position: EYE_LEVEL, TOP, BOTTOM, ENDCAP.',
      'CAMPAIGN_SKU' COMMENT 'Whether this SKU is part of an active marketing campaign.',
      'CAMPAIGN_NAME' COMMENT 'Name of the active campaign if CAMPAIGN_SKU is true.'
    )
  );

-- ============================================================================
-- SEMANTIC VIEW 3: SV_COMMERCE_REVENUE (COM Domain)
-- ============================================================================
CREATE OR REPLACE SEMANTIC VIEW SNOWRETAIL.SEMANTIC.SV_COMMERCE_REVENUE
  AS SELECT * FROM SNOWRETAIL.GOLD.SALES_DAILY
  COMMENT = 'Commerce & Revenue semantic view — sales, margin, leakage, fraud metrics for daily commercial performance.'
  WITH SEMANTICS (
    METRICS = (
      'UNITS_SOLD' COMMENT 'Total units sold in this aggregation.',
      'REVENUE_GROSS' COMMENT 'Gross revenue before discounts.',
      'DISCOUNT_AMOUNT' COMMENT 'Total discount amount applied.',
      'REVENUE_NET' COMMENT 'Net revenue after discounts. Formula: revenue_gross - discount_amount.',
      'COGS' COMMENT 'Cost of goods sold.',
      'GROSS_MARGIN' COMMENT 'Gross margin. Formula: revenue_net - cogs.',
      'SAME_STORE_SALES_GROWTH' COMMENT 'Same-store sales growth vs same day prior year. Positive = growth.',
      'REVENUE_LEAKAGE' COMMENT 'Revenue lost due to pricing errors or unauthorized discounts. Formula: expected_revenue - actual_revenue.',
      'TRANSACTIONS' COMMENT 'Number of individual transactions.',
      'BASKET_SIZE_AVG' COMMENT 'Average basket size (revenue per transaction).'
    ),
    DIMENSIONS = (
      'SALE_DATE' COMMENT 'Date of sale.',
      'STORE_ID' COMMENT 'Store identifier.',
      'STORE_NAME' COMMENT 'Store name.',
      'REGION' COMMENT 'Geographic region of the store.',
      'CATEGORY' COMMENT 'Product category: Electronics, Fashion, Home, Sports, Beauty, Kids.',
      'BRAND' COMMENT 'Product brand.',
      'CHANNEL' COMMENT 'Sales channel: STORE, WEB, APP.',
      'PAYMENT_METHOD' COMMENT 'Payment method: RIPLEY_CARD, DEBIT, CREDIT, CASH.',
      'PROMO_TYPE' COMMENT 'Promotion type if applicable: CYBERDAY, CLEARANCE, BUNDLE, or NULL.',
      'FRAUD_FLAG' COMMENT 'Whether this transaction was flagged as potentially fraudulent.'
    )
  );

-- ============================================================================
-- SEMANTIC VIEW 4: SV_SUPPLY_CHAIN (SCO Domain)
-- ============================================================================
CREATE OR REPLACE SEMANTIC VIEW SNOWRETAIL.SEMANTIC.SV_SUPPLY_CHAIN
  AS SELECT * FROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE
  COMMENT = 'Supply Chain semantic view — lead times, fill rates, stockout impact, and supplier risk scoring.'
  WITH SEMANTICS (
    METRICS = (
      'AVG_LEAD_TIME_DAYS' COMMENT 'Average supplier lead time in days.',
      'LEAD_TIME_TREND_30D' COMMENT '30-day trend in lead time. Positive = supplier getting slower.',
      'FILL_RATE' COMMENT 'Order fill rate (0-1). Percentage of ordered units actually delivered.',
      'STOCKOUT_EVENTS_CAUSED' COMMENT 'Number of stockout events attributable to this supplier delays.',
      'REVENUE_IMPACT' COMMENT 'Revenue lost due to supplier-caused stockouts.',
      'ON_TIME_DELIVERY_RATE' COMMENT 'Percentage of deliveries arriving on or before promised date.',
      'QUALITY_RETURN_RATE' COMMENT 'Percentage of units returned due to quality issues from this supplier.',
      'RISK_SCORE' COMMENT 'Composite risk score (0-100). Higher = riskier supplier.'
    ),
    DIMENSIONS = (
      'SUPPLIER_ID' COMMENT 'Unique supplier identifier.',
      'SUPPLIER_NAME' COMMENT 'Supplier company name.',
      'CATEGORY' COMMENT 'Primary product category supplied.'
    )
  );

-- ============================================================================
-- SEMANTIC VIEW 5: SV_MARKETING_GROWTH (MKT Domain)
-- ============================================================================
CREATE OR REPLACE SEMANTIC VIEW SNOWRETAIL.SEMANTIC.SV_MARKETING_GROWTH
  AS SELECT * FROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE
  COMMENT = 'Marketing & Growth semantic view — ROAS, CAC, attribution, loyalty retention for campaign performance.'
  WITH SEMANTICS (
    METRICS = (
      'TOTAL_SPEND' COMMENT 'Total campaign spend in dollars.',
      'IMPRESSIONS' COMMENT 'Total ad impressions served.',
      'CLICKS' COMMENT 'Total clicks on campaign assets.',
      'CONVERSIONS' COMMENT 'Total attributed conversions (purchases).',
      'ATTRIBUTED_REVENUE' COMMENT 'Revenue attributed to this campaign via multi-touch attribution model.',
      'ROAS' COMMENT 'Return on ad spend. Formula: attributed_revenue / total_spend. Higher = more efficient.',
      'CAC' COMMENT 'Customer acquisition cost. Formula: total_spend / new_customers_acquired.',
      'CAMPAIGN_LIFT' COMMENT 'Incremental lift vs control group. 0.15 = 15% incremental lift.',
      'LOYALTY_RETENTION' COMMENT 'Retention rate for loyalty-targeted campaigns.',
      'CTR' COMMENT 'Click-through rate. Formula: clicks / impressions.',
      'CONVERSION_RATE' COMMENT 'Conversion rate. Formula: conversions / clicks.'
    ),
    DIMENSIONS = (
      'CAMPAIGN_NAME' COMMENT 'Campaign name.',
      'CAMPAIGN_TYPE' COMMENT 'Campaign objective: ACQUISITION, RETENTION, REACTIVATION, BRAND.',
      'CHANNEL' COMMENT 'Marketing channel: EMAIL, PUSH, SOCIAL, DISPLAY, SEARCH, SMS.',
      'AUDIENCE_SEGMENT' COMMENT 'Target audience: LOYALTY_MEMBERS, LAPSED, NEW, LOOKALIKE, BROAD.',
      'QUARTER' COMMENT 'Fiscal quarter: Q1-2024, Q2-2024, etc.'
    )
  );

-- ============================================================================
-- 5. VERIFICATION
-- ============================================================================
SHOW SEMANTIC VIEWS IN SCHEMA SNOWRETAIL.SEMANTIC;
