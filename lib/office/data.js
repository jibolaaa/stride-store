// Read-only queries for the back office pages. "Today" means today in Lagos.
import { q, q1 } from "./db";

const TODAY = "(now() at time zone 'Africa/Lagos')::date";
const DAY_OF = (col) => `(${col} at time zone 'Africa/Lagos')::date`;

// Every product with its stock per size.
export async function catalogue() {
  return q(`
    select p.id, p.name, p.colour, p.gender, p.type, p.price_kobo, p.cost_kobo, p.image, p.low_stock_at, p.active,
      coalesce(json_agg(json_build_object('size', s.size, 'qty', s.qty) order by s.size) filter (where s.size is not null), '[]') as sizes,
      coalesce(sum(s.qty), 0)::int as total
    from office_products p
    left join office_stock s on s.product_id = p.id
    group by p.id
    order by p.name, p.colour`);
}

export async function product(id) {
  return q1(`
    select p.*, coalesce(json_agg(json_build_object('size', s.size, 'qty', s.qty) order by s.size) filter (where s.size is not null), '[]') as sizes
    from office_products p left join office_stock s on s.product_id = p.id
    where p.id = $1 group by p.id`, [id]);
}

export async function movements(productId, limit = 40) {
  return q(`
    select m.id, m.size, m.change, m.qty_after, m.reason, m.note, m.sale_id, m.staff_id, m.created_at, st.name as staff_name
    from office_movements m left join office_staff st on st.id = m.staff_id
    where m.product_id = $1 order by m.created_at desc, m.id desc limit $2`, [productId, limit]);
}

// Sizes at or below their product's alert level, emptiest first.
export async function lowStock() {
  return q(`
    select p.id, p.name, p.colour, p.image, s.size, s.qty, p.low_stock_at
    from office_stock s join office_products p on p.id = s.product_id
    where p.active and s.qty <= p.low_stock_at
    order by s.qty, p.name, s.size`);
}

export async function lowStockCount() {
  const r = await q1(`select count(*)::int as n from office_stock s join office_products p on p.id = s.product_id where p.active and s.qty <= p.low_stock_at`);
  return r?.n ?? 0;
}

export async function sales({ staffId = null, days = 7, limit = 150 } = {}) {
  return q(`
    select s.id, s.created_at, s.payment, s.channel, s.total_kobo, s.items_count, st.name as staff_name,
      (select string_agg(p.name || ' (' || i.size || ')' || case when i.qty > 1 then ' x' || i.qty else '' end, ', ')
         from office_sale_items i join office_products p on p.id = i.product_id where i.sale_id = s.id) as summary
    from office_sales s left join office_staff st on st.id = s.staff_id
    where ($1::int is null or s.staff_id = $1)
      and ${DAY_OF("s.created_at")} > ${TODAY} - $2::int
    order by s.created_at desc limit $3`, [staffId, days, limit]);
}

export async function sale(id) {
  const head = await q1(`
    select s.*, st.name as staff_name from office_sales s left join office_staff st on st.id = s.staff_id where s.id = $1`, [id]);
  if (!head) return null;
  const items = await q(`
    select i.product_id, i.size, i.qty, i.price_kobo, i.cost_kobo, p.name, p.colour, p.image
    from office_sale_items i join office_products p on p.id = i.product_id where i.sale_id = $1 order by p.name`, [id]);
  return { ...head, items };
}

export async function overview() {
  const [today, profit, week, best, staff, payments, value, low] = await Promise.all([
    q1(`select count(*)::int as sales, coalesce(sum(total_kobo), 0)::bigint as revenue, coalesce(sum(items_count), 0)::int as pairs
        from office_sales where ${DAY_OF("created_at")} = ${TODAY}`),
    q1(`select coalesce(sum((i.price_kobo - i.cost_kobo) * i.qty), 0)::bigint as profit
        from office_sale_items i join office_sales s on s.id = i.sale_id where ${DAY_OF("s.created_at")} = ${TODAY}`),
    q(`select to_char(d, 'YYYY-MM-DD') as day, coalesce(sum(s.total_kobo), 0)::bigint as revenue, count(s.id)::int as sales
       from generate_series(${TODAY} - 6, ${TODAY}, interval '1 day') d
       left join office_sales s on ${DAY_OF("s.created_at")} = d::date
       group by d order by d`),
    q(`select p.id, p.name, p.colour, p.image, sum(i.qty)::int as pairs, sum(i.qty * i.price_kobo)::bigint as revenue
       from office_sale_items i join office_sales s on s.id = i.sale_id join office_products p on p.id = i.product_id
       where ${DAY_OF("s.created_at")} > ${TODAY} - 7
       group by p.id order by pairs desc, revenue desc limit 5`),
    q(`select st.id, st.name, st.role, count(s.id)::int as sales, coalesce(sum(s.total_kobo), 0)::bigint as revenue
       from office_staff st left join office_sales s on s.staff_id = st.id and ${DAY_OF("s.created_at")} > ${TODAY} - 7
       where st.active group by st.id order by revenue desc, st.name`),
    q(`select payment, count(*)::int as n, sum(total_kobo)::bigint as revenue
       from office_sales where ${DAY_OF("created_at")} > ${TODAY} - 7 group by payment order by revenue desc`),
    q1(`select coalesce(sum(s.qty * p.cost_kobo), 0)::bigint as cost, coalesce(sum(s.qty * p.price_kobo), 0)::bigint as retail, coalesce(sum(s.qty), 0)::int as pairs
        from office_stock s join office_products p on p.id = s.product_id where p.active`),
    lowStock()
  ]);
  const num = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === "string" && /^\d+$/.test(v) ? Number(v) : v]));
  return {
    today: { ...num(today), profit: Number(profit.profit) },
    week: week.map(num),
    best: best.map(num),
    staff: staff.map(num),
    payments: payments.map(num),
    value: num(value),
    low
  };
}

export async function staffList() {
  return q("select id, name, email, role, active, demo, created_at from office_staff order by active desc, case role when 'owner' then 0 when 'manager' then 1 else 2 end, name");
}

// The demo accounts, listed on the sign-in page so anyone can try each role.
export async function demoLogins() {
  return q("select name, email, role from office_staff where demo and active order by case role when 'owner' then 0 when 'manager' then 1 else 2 end, id");
}

export async function isSetUp() {
  const r = await q1("select to_regclass('public.office_staff') is not null as ok");
  if (!r?.ok) return false;
  const n = await q1("select count(*)::int as n from office_staff");
  return n.n > 0;
}
