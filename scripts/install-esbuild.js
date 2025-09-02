// scripts/install-esbuild.js
// Ensures proper esbuild platform binaries are installed

const { execSync } = require("child_process");
const os = require("os");

console.log("🔧 Installing platform-specific esbuild dependencies...");

try {
  const platform = os.platform();
  const arch = os.arch();

  let esbuildPackage = "";

  if (platform === "linux" && arch === "x64") {
    esbuildPackage = "@esbuild/linux-x64";
  } else if (platform === "darwin" && arch === "arm64") {
    esbuildPackage = "@esbuild/darwin-arm64";
  } else if (platform === "darwin" && arch === "x64") {
    esbuildPackage = "@esbuild/darwin-x64";
  } else if (platform === "win32" && arch === "x64") {
    esbuildPackage = "@esbuild/win32-x64";
  }

  if (esbuildPackage) {
    console.log(`Installing ${esbuildPackage}...`);
    execSync(`npm install ${esbuildPackage}@^0.24.2 --no-save`, {
      stdio: "inherit",
      timeout: 60000,
    });
    console.log("✅ esbuild platform binary installed successfully");
  } else {
    console.log(
      "⚠️ Unknown platform, skipping platform-specific esbuild installation"
    );
  }
} catch (error) {
  console.warn(
    "⚠️ Failed to install platform-specific esbuild binary:",
    error.message
  );
  console.log("Continuing with build...");
}
