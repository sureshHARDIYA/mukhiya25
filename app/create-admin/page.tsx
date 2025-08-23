import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function createAdmin() {
  "use server";

  const supabase = await createClient();

  const email = "itsmeskm99@gmail.com";
  const password = "VSB33otmjijaji#";

  // Try to sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "admin",
      },
    },
  });

  if (error) {
    console.error("Signup error:", error);
    throw new Error(`Failed to create admin: ${error.message}`);
  }

  console.log("Admin user created:", data);
  redirect("/login");
}

export default function CreateAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Admin User
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This will create an admin user with email: itsmeskm99@gmail.com
          </p>
        </div>
        <form action={createAdmin} className="mt-8 space-y-6">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Admin User
          </button>
        </form>
        <div className="text-center">
          <a
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
