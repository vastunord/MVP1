// Paid rendering must remain closed until an atomic, durable per-user and
// aggregate allowance is implemented and independently verified. This is not
// an environment-variable switch: configuration alone cannot assert safety.
export function controlledRenderingAllowanceReady() {
  return false;
}
