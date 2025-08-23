// pages/api/setup-db.ts
import { NextApiRequest, NextApiResponse } from "next";
import { setupDatabase } from "../../scripts/setup-database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests and in development
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (process.env.NODE_ENV === "production") {
    return res
      .status(403)
      .json({ error: "Database setup not allowed in production" });
  }

  try {
    const success = await setupDatabase();

    if (success) {
      res.status(200).json({
        message: "Database setup completed successfully!",
        success: true,
      });
    } else {
      res.status(500).json({
        error: "Database setup failed",
        success: false,
      });
    }
  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({
      error: "Database setup failed",
      details: error instanceof Error ? error.message : "Unknown error",
      success: false,
    });
  }
}
