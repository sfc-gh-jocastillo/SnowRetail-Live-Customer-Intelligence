/*
=============================================================================
 SNOWRETAIL - LIVE CUSTOMER INTELLIGENCE
 Script 01: Database, Schemas, Gold Tables & Synthetic Data
 
 Creates the SNOWRETAIL database with gold-layer tables populated with
 synthetic retail data. These tables back the 5 Semantic Views that power
 the demo.
 
 Volumetry: 50 stores, 15K SKUs, 500K customers, 5M sales (2023-2024)
=============================================================================
*/

-- ============================================================================
-- 1. DATABASE & SCHEMAS
-- ============================================================================
CREATE DATABASE IF NOT EXISTS SNOWRETAIL;
CREATE SCHEMA IF NOT EXISTS SNOWRETAIL.GOLD;
CREATE SCHEMA IF NOT EXISTS SNOWRETAIL.SEMANTIC;
USE SCHEMA SNOWRETAIL.GOLD;

-- ============================================================================
-- 2. GOLD TABLES (Business-ready marts)
-- ============================================================================

-- CUSTOMER_360: Identity-resolved customer mart
CREATE OR REPLACE TABLE GOLD.CUSTOMER_360 (
    CUSTOMER_ID         NUMBER PRIMARY KEY,
    SEGMENT             VARCHAR(30),      -- VIP, PREMIUM, REGULAR, NEW, LAPSED
    LOYALTY_TIER        VARCHAR(20),      -- PLATINUM, GOLD, SILVER, BRONZE, NONE
    GENDER              VARCHAR(15),
    AGE_RANGE           VARCHAR(20),      -- 18-25, 26-35, 36-45, 46-55, 56+
    REGION              VARCHAR(50),
    CITY                VARCHAR(50),
    PREFERRED_CHANNEL   VARCHAR(30),      -- STORE, WEB, APP
    CLV                 DECIMAL(12,2),    -- Customer Lifetime Value (12-month predicted)
    CHURN_PROBABILITY   DECIMAL(5,4),     -- 0.0000 to 1.0000
    NPS_SCORE           NUMBER(3),        -- -100 to 100 (last survey)
    CROSS_SELL_PROPENSITY DECIMAL(5,4),
    DAYS_SINCE_LAST_PURCHASE NUMBER,
    PURCHASES_12M       NUMBER,
    REVENUE_12M         DECIMAL(12,2),
    AVG_BASKET_SIZE     DECIMAL(10,2),
    CHURN_RATE          DECIMAL(5,4),     -- Regional/segment aggregate
    MOM_CHANGE          DECIMAL(5,4),     -- Month-over-month churn change
    HAS_CARD            BOOLEAN,
    REGISTRATION_DATE   DATE
);

-- INVENTORY_LIVE: Real-time inventory across locations
CREATE OR REPLACE TABLE GOLD.INVENTORY_LIVE (
    SNAPSHOT_DATE       DATE,
    STORE_ID            NUMBER,
    STORE_NAME          VARCHAR(100),
    SKU_ID              NUMBER,
    PRODUCT_NAME        VARCHAR(200),
    CATEGORY            VARCHAR(50),
    STOCK_AVAILABLE     NUMBER,
    STOCK_RESERVED      NUMBER,
    STOCK_IN_TRANSIT    NUMBER,
    DAILY_SALES_AVG     DECIMAL(8,2),
    DAYS_COVERAGE       DECIMAL(6,1),
    STOCK_STATUS        VARCHAR(20),      -- NORMAL, LOW, CRITICAL, STOCKOUT, OVERSTOCK
    REORDER_POINT       NUMBER,
    SAFETY_STOCK        NUMBER,
    PRIMARY KEY (SNAPSHOT_DATE, STORE_ID, SKU_ID)
);

-- PLANOGRAM_CURRENT: Store planogram with traffic & conversion metrics
CREATE OR REPLACE TABLE GOLD.PLANOGRAM_CURRENT (
    STORE_ID            NUMBER,
    STORE_NAME          VARCHAR(100),
    AISLE               VARCHAR(30),
    SECTION             VARCHAR(50),
    SKU_ID              NUMBER,
    PRODUCT_NAME        VARCHAR(200),
    CATEGORY            VARCHAR(50),
    FOOT_TRAFFIC        NUMBER,           -- Weekly visitors to this aisle
    CONVERSION_RATE     DECIMAL(5,4),     -- Purchases / visitors in aisle
    REVENUE_PER_SQFT    DECIMAL(10,2),
    CAMPAIGN_SKU        BOOLEAN,          -- Part of active campaign?
    CAMPAIGN_NAME       VARCHAR(100),
    SHELF_POSITION      VARCHAR(20),      -- EYE_LEVEL, TOP, BOTTOM, ENDCAP
    LAST_RECONFIG_DATE  DATE,
    COMPLIANCE_SCORE    DECIMAL(5,2)      -- 0-100%
);

-- SALES_DAILY: Aggregated daily sales mart
CREATE OR REPLACE TABLE GOLD.SALES_DAILY (
    SALE_DATE           DATE,
    STORE_ID            NUMBER,
    STORE_NAME          VARCHAR(100),
    REGION              VARCHAR(50),
    CATEGORY            VARCHAR(50),
    BRAND               VARCHAR(50),
    CHANNEL             VARCHAR(30),      -- STORE, WEB, APP
    PAYMENT_METHOD      VARCHAR(30),      -- RIPLEY_CARD, DEBIT, CREDIT, CASH
    PROMO_TYPE          VARCHAR(30),      -- CYBERDAY, CLEARANCE, BUNDLE, NULL
    UNITS_SOLD          NUMBER,
    REVENUE_GROSS       DECIMAL(12,2),
    DISCOUNT_AMOUNT     DECIMAL(12,2),
    REVENUE_NET         DECIMAL(12,2),
    COGS                DECIMAL(12,2),
    GROSS_MARGIN        DECIMAL(12,2),
    SAME_STORE_SALES_GROWTH DECIMAL(5,4), -- vs same day prior year
    REVENUE_LEAKAGE     DECIMAL(12,2),    -- Expected - Actual (pricing errors)
    FRAUD_FLAG          BOOLEAN,
    TRANSACTIONS        NUMBER,
    BASKET_SIZE_AVG     DECIMAL(10,2)
);

-- CAMPAIGN_PERFORMANCE: Marketing attribution mart
CREATE OR REPLACE TABLE GOLD.CAMPAIGN_PERFORMANCE (
    CAMPAIGN_ID         NUMBER,
    CAMPAIGN_NAME       VARCHAR(200),
    CAMPAIGN_TYPE       VARCHAR(50),      -- ACQUISITION, RETENTION, REACTIVATION, BRAND
    CHANNEL             VARCHAR(30),      -- EMAIL, PUSH, SOCIAL, DISPLAY, SEARCH, SMS
    AUDIENCE_SEGMENT    VARCHAR(50),      -- LOYALTY_MEMBERS, LAPSED, NEW, LOOKALIKE, BROAD
    QUARTER             VARCHAR(10),
    START_DATE          DATE,
    END_DATE            DATE,
    TOTAL_SPEND         DECIMAL(12,2),
    IMPRESSIONS         NUMBER,
    CLICKS              NUMBER,
    CONVERSIONS         NUMBER,
    ATTRIBUTED_REVENUE  DECIMAL(12,2),
    ROAS                DECIMAL(8,4),     -- attributed_revenue / total_spend
    CAC                 DECIMAL(10,2),    -- Cost per acquisition
    CAMPAIGN_LIFT       DECIMAL(5,4),     -- Incremental lift vs control
    LOYALTY_RETENTION   DECIMAL(5,4),     -- Retention rate for loyalty campaigns
    CTR                 DECIMAL(5,4),
    CONVERSION_RATE     DECIMAL(5,4)
);

-- SUPPLIER_PERFORMANCE: Supply chain scorecard
CREATE OR REPLACE TABLE GOLD.SUPPLIER_PERFORMANCE (
    SUPPLIER_ID         NUMBER,
    SUPPLIER_NAME       VARCHAR(100),
    CATEGORY            VARCHAR(50),
    AVG_LEAD_TIME_DAYS  DECIMAL(6,1),
    LEAD_TIME_TREND_30D DECIMAL(6,1),     -- Positive = getting slower
    FILL_RATE           DECIMAL(5,4),
    STOCKOUT_EVENTS_CAUSED NUMBER,
    REVENUE_IMPACT      DECIMAL(12,2),    -- Revenue lost due to this supplier's delays
    ON_TIME_DELIVERY_RATE DECIMAL(5,4),
    QUALITY_RETURN_RATE DECIMAL(5,4),
    LAST_DELIVERY_DATE  DATE,
    CONTRACT_EXPIRY     DATE,
    RISK_SCORE          DECIMAL(5,2)      -- 0-100, higher = riskier
);

-- ============================================================================
-- 3. SYNTHETIC DATA GENERATION
-- ============================================================================

-- 3.1 CUSTOMER_360 (500K customers)
INSERT INTO GOLD.CUSTOMER_360
SELECT
    SEQ4() + 1 AS CUSTOMER_ID,
    CASE WHEN MOD(SEQ4(), 100) < 5 THEN 'VIP'
         WHEN MOD(SEQ4(), 100) < 20 THEN 'PREMIUM'
         WHEN MOD(SEQ4(), 100) < 70 THEN 'REGULAR'
         WHEN MOD(SEQ4(), 100) < 85 THEN 'NEW'
         ELSE 'LAPSED' END AS SEGMENT,
    CASE WHEN MOD(SEQ4(), 100) < 3 THEN 'PLATINUM'
         WHEN MOD(SEQ4(), 100) < 12 THEN 'GOLD'
         WHEN MOD(SEQ4(), 100) < 35 THEN 'SILVER'
         WHEN MOD(SEQ4(), 100) < 60 THEN 'BRONZE'
         ELSE 'NONE' END AS LOYALTY_TIER,
    CASE WHEN MOD(SEQ4(), 3) = 0 THEN 'Male'
         WHEN MOD(SEQ4(), 3) = 1 THEN 'Female'
         ELSE 'Other' END AS GENDER,
    CASE WHEN MOD(SEQ4(), 5) = 0 THEN '18-25'
         WHEN MOD(SEQ4(), 5) = 1 THEN '26-35'
         WHEN MOD(SEQ4(), 5) = 2 THEN '36-45'
         WHEN MOD(SEQ4(), 5) = 3 THEN '46-55'
         ELSE '56+' END AS AGE_RANGE,
    CASE WHEN MOD(SEQ4(), 6) = 0 THEN 'Metropolitana'
         WHEN MOD(SEQ4(), 6) = 1 THEN 'Valparaiso'
         WHEN MOD(SEQ4(), 6) = 2 THEN 'Biobio'
         WHEN MOD(SEQ4(), 6) = 3 THEN 'Sur'
         WHEN MOD(SEQ4(), 6) = 4 THEN 'Norte'
         ELSE 'Austral' END AS REGION,
    CASE WHEN MOD(SEQ4(), 8) = 0 THEN 'Santiago'
         WHEN MOD(SEQ4(), 8) = 1 THEN 'Viña del Mar'
         WHEN MOD(SEQ4(), 8) = 2 THEN 'Concepción'
         WHEN MOD(SEQ4(), 8) = 3 THEN 'Temuco'
         WHEN MOD(SEQ4(), 8) = 4 THEN 'Antofagasta'
         WHEN MOD(SEQ4(), 8) = 5 THEN 'La Serena'
         WHEN MOD(SEQ4(), 8) = 6 THEN 'Rancagua'
         ELSE 'Puerto Montt' END AS CITY,
    CASE WHEN MOD(SEQ4(), 3) = 0 THEN 'STORE'
         WHEN MOD(SEQ4(), 3) = 1 THEN 'WEB'
         ELSE 'APP' END AS PREFERRED_CHANNEL,
    ROUND(UNIFORM(200, 12000, RANDOM()) + (CASE WHEN MOD(SEQ4(), 100) < 5 THEN 8000 ELSE 0 END), 2) AS CLV,
    ROUND(UNIFORM(0.01, 0.35, RANDOM()), 4) AS CHURN_PROBABILITY,
    UNIFORM(-20, 90, RANDOM()) AS NPS_SCORE,
    ROUND(UNIFORM(0.05, 0.85, RANDOM()), 4) AS CROSS_SELL_PROPENSITY,
    UNIFORM(1, 180, RANDOM()) AS DAYS_SINCE_LAST_PURCHASE,
    UNIFORM(1, 48, RANDOM()) AS PURCHASES_12M,
    ROUND(UNIFORM(50, 8000, RANDOM()), 2) AS REVENUE_12M,
    ROUND(UNIFORM(25, 350, RANDOM()), 2) AS AVG_BASKET_SIZE,
    -- Regional churn rates (Sur is intentionally higher for the demo scenario)
    CASE WHEN MOD(SEQ4(), 6) = 3 THEN ROUND(UNIFORM(0.10, 0.13, RANDOM()), 4)  -- Sur: higher
         ELSE ROUND(UNIFORM(0.07, 0.10, RANDOM()), 4) END AS CHURN_RATE,
    CASE WHEN MOD(SEQ4(), 6) = 3 THEN ROUND(UNIFORM(0.01, 0.025, RANDOM()), 4) -- Sur: positive MoM (worsening)
         ELSE ROUND(UNIFORM(-0.01, 0.005, RANDOM()), 4) END AS MOM_CHANGE,
    MOD(SEQ4(), 3) != 2 AS HAS_CARD,
    DATEADD(day, -UNIFORM(30, 1800, RANDOM()), CURRENT_DATE()) AS REGISTRATION_DATE
FROM TABLE(GENERATOR(ROWCOUNT => 500000));

-- 3.2 PLANOGRAM_CURRENT (50 stores × 20 aisles × ~10 SKUs)
INSERT INTO GOLD.PLANOGRAM_CURRENT
SELECT
    MOD(SEQ4(), 50) + 1 AS STORE_ID,
    'Store ' || (MOD(SEQ4(), 50) + 1) AS STORE_NAME,
    'Aisle ' || (MOD(SEQ4() / 50, 20) + 1) AS AISLE,
    CASE WHEN MOD(SEQ4(), 6) = 0 THEN 'Electronics'
         WHEN MOD(SEQ4(), 6) = 1 THEN 'Home & Garden'
         WHEN MOD(SEQ4(), 6) = 2 THEN 'Fashion'
         WHEN MOD(SEQ4(), 6) = 3 THEN 'Sports'
         WHEN MOD(SEQ4(), 6) = 4 THEN 'Beauty'
         ELSE 'Kids' END AS SECTION,
    SEQ4() + 1 AS SKU_ID,
    'Product ' || (SEQ4() + 1) AS PRODUCT_NAME,
    CASE WHEN MOD(SEQ4(), 6) = 0 THEN 'Electronics'
         WHEN MOD(SEQ4(), 6) = 1 THEN 'Home'
         WHEN MOD(SEQ4(), 6) = 2 THEN 'Fashion'
         WHEN MOD(SEQ4(), 6) = 3 THEN 'Sports'
         WHEN MOD(SEQ4(), 6) = 4 THEN 'Beauty'
         ELSE 'Kids' END AS CATEGORY,
    UNIFORM(200, 5000, RANDOM()) AS FOOT_TRAFFIC,
    ROUND(UNIFORM(0.02, 0.18, RANDOM()), 4) AS CONVERSION_RATE,
    ROUND(UNIFORM(50, 800, RANDOM()), 2) AS REVENUE_PER_SQFT,
    MOD(SEQ4(), 7) = 0 AS CAMPAIGN_SKU,
    CASE WHEN MOD(SEQ4(), 7) = 0 THEN 'Back to School' ELSE NULL END AS CAMPAIGN_NAME,
    CASE WHEN MOD(SEQ4(), 4) = 0 THEN 'EYE_LEVEL'
         WHEN MOD(SEQ4(), 4) = 1 THEN 'TOP'
         WHEN MOD(SEQ4(), 4) = 2 THEN 'BOTTOM'
         ELSE 'ENDCAP' END AS SHELF_POSITION,
    DATEADD(day, -UNIFORM(1, 90, RANDOM()), CURRENT_DATE()) AS LAST_RECONFIG_DATE,
    ROUND(UNIFORM(60, 100, RANDOM()), 2) AS COMPLIANCE_SCORE
FROM TABLE(GENERATOR(ROWCOUNT => 10000));

-- 3.3 SALES_DAILY (730 days × 50 stores × ~3 categories = ~110K rows aggregated)
INSERT INTO GOLD.SALES_DAILY
SELECT
    DATEADD(day, MOD(SEQ4(), 730), '2023-01-01'::DATE) AS SALE_DATE,
    MOD(SEQ4() / 730, 50) + 1 AS STORE_ID,
    'Store ' || (MOD(SEQ4() / 730, 50) + 1) AS STORE_NAME,
    CASE WHEN MOD(SEQ4() / 730, 50) < 20 THEN 'Metropolitana'
         WHEN MOD(SEQ4() / 730, 50) < 30 THEN 'Valparaiso'
         WHEN MOD(SEQ4() / 730, 50) < 38 THEN 'Biobio'
         WHEN MOD(SEQ4() / 730, 50) < 44 THEN 'Sur'
         ELSE 'Norte' END AS REGION,
    CASE WHEN MOD(SEQ4(), 6) = 0 THEN 'Electronics'
         WHEN MOD(SEQ4(), 6) = 1 THEN 'Fashion'
         WHEN MOD(SEQ4(), 6) = 2 THEN 'Home'
         WHEN MOD(SEQ4(), 6) = 3 THEN 'Sports'
         WHEN MOD(SEQ4(), 6) = 4 THEN 'Beauty'
         ELSE 'Kids' END AS CATEGORY,
    CASE WHEN MOD(SEQ4(), 5) = 0 THEN 'Samsung'
         WHEN MOD(SEQ4(), 5) = 1 THEN 'Nike'
         WHEN MOD(SEQ4(), 5) = 2 THEN 'Private Label'
         WHEN MOD(SEQ4(), 5) = 3 THEN 'Sony'
         ELSE 'Adidas' END AS BRAND,
    CASE WHEN MOD(SEQ4(), 3) = 0 THEN 'STORE'
         WHEN MOD(SEQ4(), 3) = 1 THEN 'WEB'
         ELSE 'APP' END AS CHANNEL,
    CASE WHEN MOD(SEQ4(), 4) = 0 THEN 'RIPLEY_CARD'
         WHEN MOD(SEQ4(), 4) = 1 THEN 'DEBIT'
         WHEN MOD(SEQ4(), 4) = 2 THEN 'CREDIT'
         ELSE 'CASH' END AS PAYMENT_METHOD,
    CASE WHEN MOD(SEQ4(), 10) = 0 THEN 'CYBERDAY'
         WHEN MOD(SEQ4(), 10) = 1 THEN 'CLEARANCE'
         WHEN MOD(SEQ4(), 10) = 2 THEN 'BUNDLE'
         ELSE NULL END AS PROMO_TYPE,
    UNIFORM(5, 120, RANDOM()) AS UNITS_SOLD,
    ROUND(UNIFORM(1000, 50000, RANDOM()), 2) AS REVENUE_GROSS,
    ROUND(UNIFORM(0, 5000, RANDOM()), 2) AS DISCOUNT_AMOUNT,
    ROUND(UNIFORM(800, 48000, RANDOM()), 2) AS REVENUE_NET,
    ROUND(UNIFORM(500, 30000, RANDOM()), 2) AS COGS,
    ROUND(UNIFORM(200, 18000, RANDOM()), 2) AS GROSS_MARGIN,
    ROUND(UNIFORM(-0.05, 0.12, RANDOM()), 4) AS SAME_STORE_SALES_GROWTH,
    ROUND(UNIFORM(0, 200, RANDOM()) * (CASE WHEN MOD(SEQ4(), 50) = 0 THEN 5 ELSE 0.1 END), 2) AS REVENUE_LEAKAGE,
    MOD(SEQ4(), 200) = 0 AS FRAUD_FLAG,
    UNIFORM(10, 200, RANDOM()) AS TRANSACTIONS,
    ROUND(UNIFORM(25, 350, RANDOM()), 2) AS BASKET_SIZE_AVG
FROM TABLE(GENERATOR(ROWCOUNT => 219000));

-- 3.4 CAMPAIGN_PERFORMANCE
INSERT INTO GOLD.CAMPAIGN_PERFORMANCE
SELECT
    SEQ4() + 1 AS CAMPAIGN_ID,
    'Campaign ' || (SEQ4() + 1) AS CAMPAIGN_NAME,
    CASE WHEN MOD(SEQ4(), 4) = 0 THEN 'ACQUISITION'
         WHEN MOD(SEQ4(), 4) = 1 THEN 'RETENTION'
         WHEN MOD(SEQ4(), 4) = 2 THEN 'REACTIVATION'
         ELSE 'BRAND' END AS CAMPAIGN_TYPE,
    CASE WHEN MOD(SEQ4(), 6) = 0 THEN 'EMAIL'
         WHEN MOD(SEQ4(), 6) = 1 THEN 'PUSH'
         WHEN MOD(SEQ4(), 6) = 2 THEN 'SOCIAL'
         WHEN MOD(SEQ4(), 6) = 3 THEN 'DISPLAY'
         WHEN MOD(SEQ4(), 6) = 4 THEN 'SEARCH'
         ELSE 'SMS' END AS CHANNEL,
    CASE WHEN MOD(SEQ4(), 5) = 0 THEN 'LOYALTY_MEMBERS'
         WHEN MOD(SEQ4(), 5) = 1 THEN 'LAPSED'
         WHEN MOD(SEQ4(), 5) = 2 THEN 'NEW'
         WHEN MOD(SEQ4(), 5) = 3 THEN 'LOOKALIKE'
         ELSE 'BROAD' END AS AUDIENCE_SEGMENT,
    CASE WHEN MOD(SEQ4(), 4) = 0 THEN 'Q1-2024'
         WHEN MOD(SEQ4(), 4) = 1 THEN 'Q2-2024'
         WHEN MOD(SEQ4(), 4) = 2 THEN 'Q3-2024'
         ELSE 'Q4-2024' END AS QUARTER,
    DATEADD(day, -UNIFORM(30, 365, RANDOM()), CURRENT_DATE()) AS START_DATE,
    DATEADD(day, -UNIFORM(1, 29, RANDOM()), CURRENT_DATE()) AS END_DATE,
    ROUND(UNIFORM(5000, 200000, RANDOM()), 2) AS TOTAL_SPEND,
    UNIFORM(50000, 5000000, RANDOM()) AS IMPRESSIONS,
    UNIFORM(1000, 100000, RANDOM()) AS CLICKS,
    UNIFORM(50, 5000, RANDOM()) AS CONVERSIONS,
    ROUND(UNIFORM(20000, 800000, RANDOM()), 2) AS ATTRIBUTED_REVENUE,
    -- ROAS: loyalty emails intentionally higher (4.5x) for the demo scenario
    CASE WHEN MOD(SEQ4(), 5) = 0 AND MOD(SEQ4(), 6) = 0 THEN ROUND(UNIFORM(4.0, 5.5, RANDOM()), 4)
         WHEN MOD(SEQ4(), 5) = 0 THEN ROUND(UNIFORM(3.5, 5.0, RANDOM()), 4)
         ELSE ROUND(UNIFORM(1.5, 4.0, RANDOM()), 4) END AS ROAS,
    ROUND(UNIFORM(15, 80, RANDOM()), 2) AS CAC,
    ROUND(UNIFORM(0.05, 0.35, RANDOM()), 4) AS CAMPAIGN_LIFT,
    ROUND(UNIFORM(0.70, 0.95, RANDOM()), 4) AS LOYALTY_RETENTION,
    ROUND(UNIFORM(0.005, 0.08, RANDOM()), 4) AS CTR,
    ROUND(UNIFORM(0.01, 0.12, RANDOM()), 4) AS CONVERSION_RATE
FROM TABLE(GENERATOR(ROWCOUNT => 2000));

-- 3.5 SUPPLIER_PERFORMANCE
INSERT INTO GOLD.SUPPLIER_PERFORMANCE
SELECT
    SEQ4() + 1 AS SUPPLIER_ID,
    CASE WHEN MOD(SEQ4(), 10) = 0 THEN 'GlobalTech Supply Co'
         WHEN MOD(SEQ4(), 10) = 1 THEN 'Andina Fashion Group'
         WHEN MOD(SEQ4(), 10) = 2 THEN 'Pacific Home Imports'
         WHEN MOD(SEQ4(), 10) = 3 THEN 'SportsGear Chile'
         WHEN MOD(SEQ4(), 10) = 4 THEN 'BeautyLab LATAM'
         WHEN MOD(SEQ4(), 10) = 5 THEN 'KidsWorld Distribution'
         WHEN MOD(SEQ4(), 10) = 6 THEN 'ElectroAsia Trading'
         WHEN MOD(SEQ4(), 10) = 7 THEN 'MegaTextil Santiago'
         WHEN MOD(SEQ4(), 10) = 8 THEN 'HomeStyle Imports'
         ELSE 'TechDirect Korea' END AS SUPPLIER_NAME,
    CASE WHEN MOD(SEQ4(), 6) = 0 THEN 'Electronics'
         WHEN MOD(SEQ4(), 6) = 1 THEN 'Fashion'
         WHEN MOD(SEQ4(), 6) = 2 THEN 'Home'
         WHEN MOD(SEQ4(), 6) = 3 THEN 'Sports'
         WHEN MOD(SEQ4(), 6) = 4 THEN 'Beauty'
         ELSE 'Kids' END AS CATEGORY,
    ROUND(UNIFORM(5, 45, RANDOM()), 1) AS AVG_LEAD_TIME_DAYS,
    -- Some suppliers intentionally trending late for the demo scenario
    CASE WHEN MOD(SEQ4(), 10) IN (0, 6, 9) THEN ROUND(UNIFORM(2, 6, RANDOM()), 1)
         ELSE ROUND(UNIFORM(-2, 1, RANDOM()), 1) END AS LEAD_TIME_TREND_30D,
    ROUND(UNIFORM(0.85, 0.99, RANDOM()), 4) AS FILL_RATE,
    CASE WHEN MOD(SEQ4(), 10) IN (0, 6, 9) THEN UNIFORM(3, 15, RANDOM())
         ELSE UNIFORM(0, 3, RANDOM()) END AS STOCKOUT_EVENTS_CAUSED,
    CASE WHEN MOD(SEQ4(), 10) IN (0, 6, 9) THEN ROUND(UNIFORM(100000, 500000, RANDOM()), 2)
         ELSE ROUND(UNIFORM(0, 50000, RANDOM()), 2) END AS REVENUE_IMPACT,
    ROUND(UNIFORM(0.80, 0.98, RANDOM()), 4) AS ON_TIME_DELIVERY_RATE,
    ROUND(UNIFORM(0.005, 0.05, RANDOM()), 4) AS QUALITY_RETURN_RATE,
    DATEADD(day, -UNIFORM(1, 30, RANDOM()), CURRENT_DATE()) AS LAST_DELIVERY_DATE,
    DATEADD(day, UNIFORM(30, 365, RANDOM()), CURRENT_DATE()) AS CONTRACT_EXPIRY,
    ROUND(UNIFORM(10, 90, RANDOM()), 2) AS RISK_SCORE
FROM TABLE(GENERATOR(ROWCOUNT => 200));

-- ============================================================================
-- 4. VERIFICATION
-- ============================================================================
SELECT 'CUSTOMER_360' AS TABLE_NAME, COUNT(*) AS ROW_COUNT FROM GOLD.CUSTOMER_360
UNION ALL SELECT 'INVENTORY_LIVE', COUNT(*) FROM GOLD.INVENTORY_LIVE
UNION ALL SELECT 'PLANOGRAM_CURRENT', COUNT(*) FROM GOLD.PLANOGRAM_CURRENT
UNION ALL SELECT 'SALES_DAILY', COUNT(*) FROM GOLD.SALES_DAILY
UNION ALL SELECT 'CAMPAIGN_PERFORMANCE', COUNT(*) FROM GOLD.CAMPAIGN_PERFORMANCE
UNION ALL SELECT 'SUPPLIER_PERFORMANCE', COUNT(*) FROM GOLD.SUPPLIER_PERFORMANCE;
