export async function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  const Stripe = (await import("stripe")).default;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });
}
