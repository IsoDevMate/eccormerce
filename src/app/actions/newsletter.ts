"use server";

import { z } from "zod";

const emailSchema = z.string().trim().email();

export async function subscribeEmail(formData: FormData) {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { ok: false as const, error: "Enter a valid email." };
  }

  // Turso write lands here once credentials exist.
  // UI-first: accept the capture so the delayed overlay can close.
  return { ok: true as const, email: parsed.data };
}

export async function subscribeEmailForm(formData: FormData) {
  await subscribeEmail(formData);
}
