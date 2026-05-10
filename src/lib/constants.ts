export const PRODUCT_TYPE_DEFAULTS = [
  { name: "Jewelry", slug: "jewelry", productionMinutesPerUnit: 45 },
  { name: "Ceramics", slug: "ceramics", productionMinutesPerUnit: 80 },
  { name: "Candles", slug: "candles", productionMinutesPerUnit: 35 },
  { name: "Fiber Arts", slug: "fiber-arts", productionMinutesPerUnit: 70 },
  { name: "Woodworking", slug: "woodworking", productionMinutesPerUnit: 95 },
  { name: "Other", slug: "other", productionMinutesPerUnit: 60 },
] as const;

export const ORDER_STATUSES = [
  "INQUIRY",
  "CONFIRMED",
  "IN_PRODUCTION",
  "COMPLETE",
  "SHIPPED",
] as const;

export const HOLIDAY_DEFAULTS = {
  Q4: { label: "Q4 / Christmas", cutoff: "2026-12-18" },
  VALENTINES: { label: "Valentine's Day", cutoff: "2027-02-10" },
  MOTHERS_DAY: { label: "Mother's Day", cutoff: "2027-05-05" },
} as const;

export const PLAN_DEFINITIONS = [
  {
    id: "solo-monthly",
    name: "Solo Monthly",
    price: "$19",
    cadence: "/mo",
    description: "1 user, 3 intake forms, unlimited orders",
    lookupKey: "STRIPE_SOLO_MONTHLY_PRICE_ID",
  },
  {
    id: "solo-annual",
    name: "Solo Annual",
    price: "$152",
    cadence: "/yr",
    description: "2 months free for seasonal makers who stick",
    lookupKey: "STRIPE_SOLO_ANNUAL_PRICE_ID",
  },
  {
    id: "studio-monthly",
    name: "Studio Monthly",
    price: "$39",
    cadence: "/mo",
    description: "3 users, unlimited forms, multi-maker collaboration",
    lookupKey: "STRIPE_STUDIO_MONTHLY_PRICE_ID",
  },
  {
    id: "studio-annual",
    name: "Studio Annual",
    price: "$312",
    cadence: "/yr",
    description: "Priority support and annual savings",
    lookupKey: "STRIPE_STUDIO_ANNUAL_PRICE_ID",
  },
] as const;
