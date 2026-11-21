import { defineConfig } from "prisma/config";

// Validation and SQL diff work without credentials. Deployment requires the
// dedicated Vastu Nord migration role; never fall back to another database.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DIRECT_DATABASE_URL ?? "" },
});
