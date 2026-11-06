with source as (
    select * from {{ ref('orders') }}
)
select
    cast(order_id as integer) as order_id,
    cast(customer_id as integer) as customer_id,
    lower(trim(status)) as status,
    cast(amount_cents as integer) as amount_cents
from source
