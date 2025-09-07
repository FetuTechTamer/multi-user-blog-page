"use server";

import { profileSchema } from "@/lib/validation/profile";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as z from "zod";

export async function UpdateSettings(context: z.infer<typeof profileSchema>) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // ✅ Validate input
    const profile = profileSchema.parse(context);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: `${profile.firstName} ${profile.lastName}`,
        username: profile.userName,
        avatar_url: profile.avatarUrl,
        website: profile.website,
      })
      .eq("id", profile.id);

    if (error) {
      console.error("Supabase update error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("Validation error:", err.errors);
      return {
        success: false,
        error: "Invalid profile data",
        details: err.errors, // optional: send exact validation issues
      };
    }

    console.error("Unexpected error:", err);
    return { success: false, error: "Unexpected error occurred" };
  }
}
