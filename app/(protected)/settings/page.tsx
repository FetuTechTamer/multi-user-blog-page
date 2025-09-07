import ProtectedSettingsProfile from "@/components/protected/settings/protected-settings-profile";
import { Profile } from "@/types/collection";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { FC, useState } from "react";

export const revalidate = 0;

interface ErrorMessageProps {
  message: string;
  details?: any;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message, details }) => (
  <div className="max-w-3xl px-10 py-6 border border-red-400 rounded-md bg-red-50">
    <h2 className="font-bold text-red-700 mb-2">Error</h2>
    <p className="text-red-600">{message}</p>
    {details && (
      <pre className="mt-2 text-sm text-red-500 overflow-x-auto">
        {JSON.stringify(details, null, 2)}
      </pre>
    )}
  </div>
);

// Helper to get the current user ID from Supabase session
async function getUserId() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return { userId: null, error };
    }

    return { userId: session?.user?.id ?? null, error: null };
  } catch (err) {
    return { userId: null, error: err };
  }
}

const SettingsPage = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { userId, error: sessionError } = await getUserId();

  if (sessionError) {
    return (
      <ErrorMessage
        message="Failed to get user session."
        details={sessionError}
      />
    );
  }

  if (!userId) {
    return (
      <ErrorMessage
        message="No user is currently logged in. Please log in to access this page."
      />
    );
  }

  // Fetch user profile safely
  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<Profile>();

  if (profileError) {
    return (
      <ErrorMessage
        message="Failed to fetch user profile from Supabase."
        details={profileError}
      />
    );
  }

  if (!data) {
    return (
      <ErrorMessage
        message="No profile found for this user."
        details={{
          suggestion: "You may need to create a profile row in the 'profiles' table.",
          userId,
        }}
      />
    );
  }

  return (
    <div className="max-w-3xl px-10">
      <ProtectedSettingsProfile user={data} />
    </div>
  );
};

export default SettingsPage;
