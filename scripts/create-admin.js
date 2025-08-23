// scripts/create-admin.js
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://kdqbaiezfxtkdwfhjyct.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcWJhaWV6Znh0a2R3ZmhqeWN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDQwNTg1MiwiZXhwIjoyMDQwMDE4MDUyfQ.kKsOoAIjKrO2k4LrNd9bh3jnF4S0hDVNmKYILCjNpKQ";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdmin() {
  try {
    // First, try to delete existing user if any
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(
      (user) => user.email === "itsmeskm99@gmail.com"
    );

    if (existingUser) {
      console.log("Deleting existing user...");
      await supabase.auth.admin.deleteUser(existingUser.id);
    }

    // Create new admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: "itsmeskm99@gmail.com",
      password: "VSB33otmjijaji#",
      email_confirm: true,
      user_metadata: {
        role: "admin",
      },
    });

    if (error) {
      console.error("Error creating admin user:", error);
    } else {
      console.log("Admin user created successfully:", data);
      console.log("Email: itsmeskm99@gmail.com");
      console.log("Password: VSB33otmjijaji#");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

createAdmin();
