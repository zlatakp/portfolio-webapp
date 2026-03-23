import { getServerAuthSession } from "@/lib/auth";

/**
 * Returns true when the current request has an authenticated admin session.
 */
export async function requireAdminSession() {
  const session = await getServerAuthSession();

  return session;
}
