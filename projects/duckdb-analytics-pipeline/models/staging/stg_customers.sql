with source as (
    select * from {{ ref('customers') }}
)
select
    cast(customer_id as integer) as customer_id,
    trim(customer_name) as customer_name
from source
