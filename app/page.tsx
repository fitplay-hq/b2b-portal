import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "./api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(auth);
  if (!session || !session.user) {
    redirect("/login");
  }

  console.log("Session:", session?.user);
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/client");
  }
}
