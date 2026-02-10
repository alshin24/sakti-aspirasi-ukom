import { AdminAspirasiDetailPage } from "@/components/pages/admin/admin-aspirasi-detail-page"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <AdminAspirasiDetailPage id={resolvedParams.id} />
}
