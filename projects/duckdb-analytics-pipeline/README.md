# DuckDB Analytics Pipeline — dbt

An original, locally runnable dbt example demonstrating staging models, a revenue mart, schema tests, data quality, and SQL lineage using DuckDB. It is *inspired by the learning workflow* of [dbt Jaffle Shop DuckDB](https://github.com/dbt-labs/jaffle_shop_duckdb), but uses independent sample data and original models.

## Run locally

```bash
cd projects/duckdb-analytics-pipeline
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
dbt deps
dbt seed --profiles-dir .
dbt build --profiles-dir .
dbt docs generate --profiles-dir .
dbt docs serve --profiles-dir .
```

All operations run on your computer. No AWS account required.

## Architecture

CSV seeds (customers, orders) → staging models (typed, cleaned) → `fct_customer_revenue` (business metrics) → dbt tests / documentation.

## Demo data and expected results

- 3 customers, 6 orders.
- 4 paid orders totaling **$175.00**.
- Ada: $75.00, Ben: $100.00, Cleo: $0.00.
- Cancelled and pending orders are excluded from paid revenue.

The website includes an interactive browser-only analytics preview using the same sample data and business rules. It runs actual JavaScript aggregations, **not** a dbt or DuckDB backend.

## Attribution

The upstream [dbt-labs/jaffle_shop_duckdb](https://github.com/dbt-labs/jaffle_shop_duckdb) project (Apache-2.0) served as conceptual inspiration. This repository's sample dataset and SQL models are separate original examples.
