type EmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendAppEmail({ to, subject, html }: EmailInput) {
  if (!process.env.RESEND_API_KEY) {
    console.info("Resend not configured; email suppressed.", { to, subject });
    return { delivered: false, fallback: true };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "MakerPipeline <notifications@makerpipeline.app>",
    to,
    subject,
    html,
  });

  return { delivered: true, fallback: false };
}
