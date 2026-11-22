import { getPayload } from "payload";
import config from "../src/payload.config.ts";
import { bootstrapStaff } from "../src/collections.ts";

const email = process.env.VASTUNORD_CMS_BOOTSTRAP_EMAIL;
const password = process.env.VASTUNORD_CMS_BOOTSTRAP_PASSWORD;
if (!email || !password || password.length < 20)
  throw new Error(
    "Supply the first administrator through protected migration-runner variables.",
  );
const payload = await getPayload({ config });
const lock = await payload.db.pool.connect();
try {
  // Keep a transaction-pinned operator connection while Payload inserts the initial account.
  await lock.query("BEGIN");
  const result = await lock.query(
    "SELECT pg_try_advisory_xact_lock(1414676811, 1) AS acquired",
  );
  if (!result.rows[0]?.acquired)
    throw new Error("The first administrator setup is already in progress.");
  const staff = await payload.count({
    collection: "staff",
    overrideAccess: true,
  });
  if (staff.totalDocs !== 0)
    throw new Error("Staff already exists. Use the authenticated admin area.");
  await payload.create({
    collection: "staff",
    data: { email, password, role: "administrator" },
    context: { [bootstrapStaff]: true },
    overrideAccess: true,
  });
  console.log("The first CMS administrator has been created.");
} finally {
  try {
    await lock.query("ROLLBACK");
  } finally {
    lock.release();
  }
  await payload.destroy();
  await payload.db.pool.end();
}
