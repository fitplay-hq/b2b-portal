import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "./api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(auth);
  if (!session || !session.user) {
    redirect("/login");
  }

  // Redirect based on role
  if (session.user.role === "ADMIN" || session.user.role === "SYSTEM_USER") {
    redirect("/admin");
  } else if (session.user.role === "CLIENT") {
    redirect("/client");
  } else {
    // Fallback for unknown roles
    redirect("/login");
  }
}
