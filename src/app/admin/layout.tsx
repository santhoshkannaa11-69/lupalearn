import { redirect } from "next/navigation"
import { getSession } from "@/lib/admin-auth"
import { AdminLayout } from "@/components/admin/AdminLayout"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session.authenticated) {
    redirect("/admin/login")
  }

  return <AdminLayout>{children}</AdminLayout>
}
