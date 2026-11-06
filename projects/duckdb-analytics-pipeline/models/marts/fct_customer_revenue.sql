with paid_orders as (
    select customer_id, amount_cents
    from {{ ref('stg_orders') }}
    where status = 'paid'
),
revenue as (
    select customer_id, count(*) as paid_order_count, sum(amount_cents) as total_cents
    from paid_orders
    group by customer_id
)
select
    c.customer_id,
    c.customer_name,
    coalesce(r.paid_order_count, 0) as paid_order_count,
    coalesce(r.total_cents, 0) as revenue_cents
from {{ ref('stg_customers') }} as c
left join revenue as r on c.customer_id = r.customer_id
