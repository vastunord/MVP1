import { APIError, buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resolve } from "node:path";
import { Articles, Staff } from "./collections.ts";

export function createCmsConfig(settings: {
  secret: string;
  connectionString: string;
}) {
  return buildConfig({
    secret: settings.secret,
    telemetry: false,
    email: () => ({
      name: "staff-email-disabled",
      defaultFromAddress: "no-reply@vastu.no",
      defaultFromName: "Vastu Nord",
      sendEmail: async () => {
        throw new APIError(
          "Editorial email delivery requires a configured staff sender.",
          503,
        );
      },
    }),
    admin: {
      user: Staff.slug,
      importMap: { baseDir: resolve("src") },
    },
    db: postgresAdapter({
      pool: { connectionString: settings.connectionString },
      push: false,
      disableCreateDatabase: true,
      migrationDir: resolve("src/migrations"),
    }),
    graphQL: { disable: true },
    collections: [Staff, Articles],
    typescript: {
      outputFile: resolve("src", "payload-types.ts"),
      autoGenerate: false,
    },
  });
}
