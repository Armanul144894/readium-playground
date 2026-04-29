"use server";

export const isManifestRouteEnabled = async (): Promise<boolean> => {
  const explicitDisable =
    process.env.MANIFEST_ROUTE_FORCE_ENABLE === "false" ||
    process.env.MANIFEST_ROUTE_DISABLE === "true";

  return !explicitDisable;
};
