// The back office tables. Money is in kobo (₦1 = 100 kobo), like the shop.
// Selling and stock changes run inside database functions, so a sale either
// happens completely (stock down, sale saved, history written) or not at all.

export const DROP = [
  "drop function if exists office_record_sale(int, jsonb, text, text, timestamptz, text)",
  "drop function if exists office_move_stock(int, text, int, int, text, text, timestamptz)",
  "drop table if exists office_movements, office_sale_items, office_sales, office_stock, office_products, office_staff cascade"
];

export const CREATE = [
  `create table if not exists office_staff (
    id serial primary key,
    name text not null check (length(name) between 2 and 80),
    email text not null unique,
    password_hash text not null,
    role text not null check (role in ('owner', 'manager', 'cashier')),
    active boolean not null default true,
    demo boolean not null default false,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists office_products (
    id text primary key,
    name text not null,
    colour text not null,
    gender text not null,
    type text not null,
    price_kobo int not null check (price_kobo >= 0),
    cost_kobo int not null default 0 check (cost_kobo >= 0),
    image text,
    low_stock_at int not null default 1 check (low_stock_at >= 0),
    active boolean not null default true
  )`,
  `create table if not exists office_stock (
    product_id text not null references office_products(id) on delete cascade,
    size int not null,
    qty int not null default 0 check (qty >= 0),
    primary key (product_id, size)
  )`,
  `create table if not exists office_sales (
    id serial primary key,
    staff_id int references office_staff(id),
    channel text not null default 'shop' check (channel in ('shop', 'online')),
    payment text not null check (payment in ('cash', 'transfer', 'card')),
    total_kobo int not null default 0,
    items_count int not null default 0,
    note text,
    ref text unique,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists office_sale_items (
    sale_id int not null references office_sales(id) on delete cascade,
    product_id text not null references office_products(id),
    size int not null,
    qty int not null check (qty > 0),
    price_kobo int not null,
    cost_kobo int not null default 0
  )`,
  `create table if not exists office_movements (
    id serial primary key,
    product_id text not null references office_products(id) on delete cascade,
    size int not null,
    change int not null,
    qty_after int not null,
    reason text not null check (reason in ('sale', 'restock', 'writeoff', 'count', 'setup')),
    note text,
    staff_id int references office_staff(id),
    sale_id int references office_sales(id) on delete set null,
    created_at timestamptz not null default now()
  )`,
  "create index if not exists office_sales_created on office_sales (created_at desc)",
  "create index if not exists office_movements_product on office_movements (product_id, created_at desc)",

  // One sale: checks every line, takes the pairs out of stock, saves the
  // sale and its lines, and writes the stock history. Any problem cancels it all.
  // p_ref is a code the till makes for each sale: if the same sale is sent
  // twice (a retry on a bad connection), the first one is returned, not a copy.
  `create or replace function office_record_sale(p_staff int, p_items jsonb, p_payment text, p_note text, p_at timestamptz default now(), p_ref text default null)
  returns int language plpgsql as $$
  declare
    v_sale int; v_total int := 0; v_count int := 0; v_price int; v_cost int; v_left int; it record;
  begin
    if p_ref is not null then
      select id into v_sale from office_sales where ref = p_ref;
      if found then return v_sale; end if;
    end if;
    if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
      raise exception 'EMPTY_SALE';
    end if;
    insert into office_sales (staff_id, payment, note, created_at, ref) values (p_staff, p_payment, p_note, p_at, p_ref) returning id into v_sale;
    for it in select * from jsonb_to_recordset(p_items) as x(product_id text, size int, qty int) loop
      if it.qty is null or it.qty < 1 or it.qty > 20 then raise exception 'BAD_QTY'; end if;
      select price_kobo, cost_kobo into v_price, v_cost from office_products where id = it.product_id and active;
      if not found then raise exception 'NO_PRODUCT:%', it.product_id; end if;
      update office_stock set qty = qty - it.qty
        where product_id = it.product_id and size = it.size and qty >= it.qty
        returning qty into v_left;
      if not found then raise exception 'NO_STOCK:%:%', it.product_id, it.size; end if;
      insert into office_sale_items (sale_id, product_id, size, qty, price_kobo, cost_kobo)
        values (v_sale, it.product_id, it.size, it.qty, v_price, v_cost);
      insert into office_movements (product_id, size, change, qty_after, reason, staff_id, sale_id, created_at)
        values (it.product_id, it.size, -it.qty, v_left, 'sale', p_staff, v_sale, p_at);
      v_total := v_total + v_price * it.qty;
      v_count := v_count + it.qty;
    end loop;
    update office_sales set total_kobo = v_total, items_count = v_count where id = v_sale;
    return v_sale;
  end $$`,

  // Restock, write-off or stock count for one size. Never lets stock go below zero.
  `create or replace function office_move_stock(p_staff int, p_product text, p_size int, p_change int, p_reason text, p_note text, p_at timestamptz default now())
  returns int language plpgsql as $$
  declare v_left int;
  begin
    if p_change = 0 then raise exception 'NO_CHANGE'; end if;
    if p_change > 0 then
      insert into office_stock (product_id, size, qty) values (p_product, p_size, p_change)
        on conflict (product_id, size) do update set qty = office_stock.qty + excluded.qty
        returning qty into v_left;
    else
      update office_stock set qty = qty + p_change
        where product_id = p_product and size = p_size and qty + p_change >= 0
        returning qty into v_left;
      if not found then raise exception 'NOT_ENOUGH'; end if;
    end if;
    insert into office_movements (product_id, size, change, qty_after, reason, note, staff_id, created_at)
      values (p_product, p_size, p_change, v_left, p_reason, p_note, p_staff, p_at);
    return v_left;
  end $$`
];
