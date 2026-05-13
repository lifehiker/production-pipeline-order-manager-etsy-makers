import { NextResponse } from "next/server";

import { sendAppEmail } from "@/lib/email";
import { getDb } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/storage";
import type { IntakeField } from "@/lib/types";

export async function POST(request: Request) {
  const formData = await request.formData();
  const formSlug = String(formData.get("formSlug") || "");
  const db = getDb();
  const intakeForm = await db.intakeForm.findUnique({
    where: { slug: formSlug },
    include: { shop: { include: { owner: true, productTypes: true } } },
  });

  if (!intakeForm) {
    return NextResponse.redirect(new URL(`/f/${formSlug}?error=missing`, request.url));
  }

  const fields = intakeForm.fields as IntakeField[];
  const values = Object.fromEntries(formData.entries());
  const referenceFiles: string[] = [];

  for (const field of fields) {
    const value = formData.get(field.id);
    if (field.type === "file" && value instanceof File && value.size > 0) {
      const savedPath = await saveUploadedFile(value);
      referenceFiles.push(savedPath);
    }
  }

  const customerName =
    String(values["customer-name"] || values["customerName"] || "New customer");
  const customerEmail = String(values["customer-email"] || values["customerEmail"] || "");
  const itemDescription = String(
    values["item-description"] || values["itemDescription"] || "Custom order",
  );
  const quantity = Number(values.quantity || 1);
  const dueDateString = String(
    values["due-date"] || values["needed-by"] || values.dueDate || "",
  );
  const requestedProductType = String(
    values["product-type"] || values.productType || "",
  ).trim();
  const selectedProductType =
    intakeForm.shop.productTypes.find(
      (productType) =>
        productType.id === requestedProductType ||
        productType.name.toLowerCase() === requestedProductType.toLowerCase(),
    ) || intakeForm.shop.productTypes[0];

  await db.order.create({
    data: {
      shopId: intakeForm.shopId,
      intakeFormId: intakeForm.id,
      productTypeId: selectedProductType?.id,
      customerName,
      customerEmail,
      itemDescription,
      quantity,
      dueDate: dueDateString ? new Date(dueDateString) : null,
      productionMinutes:
        quantity * (selectedProductType?.productionMinutesPerUnit || 45),
      notes: JSON.stringify(values, null, 2),
      referenceFiles,
    },
  });

  if (intakeForm.shop.owner.email) {
    await sendAppEmail({
      to: intakeForm.shop.owner.email,
      subject: `New custom order from ${customerName}`,
      html: `<p>New custom order from ${customerName}</p><p>${itemDescription}</p><p>Qty ${quantity}</p><p>Due ${dueDateString || "Not provided"}</p>`,
    });
  }

  return NextResponse.redirect(new URL(`/f/${formSlug}?submitted=1`, request.url));
}
