import { VirtualFile } from "./virtual-file-tree";

export function emitPackageJson(
  basePackageJsonContent: string,
  extraDependencies: Record<string, string>,
  appName?: string
): VirtualFile {
  let pkg: any;
  try {
    pkg = JSON.parse(basePackageJsonContent);
  } catch {
    pkg = { name: "zalo-mini-app", version: "1.0.0", dependencies: {}, devDependencies: {} };
  }

  if (appName) {
    // Sanitize app package name for npm
    pkg.name = appName
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  pkg.dependencies = pkg.dependencies || {};

  for (const [depName, reqVersion] of Object.entries(extraDependencies)) {
    const existingVersion = pkg.dependencies[depName];
    if (existingVersion && existingVersion !== reqVersion) {
      // Extract major version numbers if possible
      const getMajor = (v: string) => v.replace(/[^0-9.]/g, "").split(".")[0];
      if (getMajor(existingVersion) !== getMajor(reqVersion)) {
        throw new Error(
          `Version conflict detected for dependency "${depName}": base project uses "${existingVersion}" but block requires "${reqVersion}".`
        );
      }
    }
    if (!existingVersion) {
      pkg.dependencies[depName] = reqVersion;
    }
  }

  return {
    path: "package.json",
    content: JSON.stringify(pkg, null, 2),
  };
}
