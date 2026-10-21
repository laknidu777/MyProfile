import { auth } from "@/auth";
import { redirect } from "next/navigation";

export interface CurrentAdminUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
}

export async function requireAdmin(): Promise<CurrentAdminUser> {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const role = (session.user as Record<string, unknown>).role;
  if (role !== "ADMIN") {
    redirect("/admin/login?error=UnauthorizedRole");
  }

  return {
    id: session.user.id || "",
    name: session.user.name,
    email: session.user.email,
    role: "ADMIN",
  };
}

export async function getAdminSession() {
  return await auth();
}
