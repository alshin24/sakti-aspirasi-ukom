import { AspirasiDetailPage } from "@/components/pages/murid/aspirasi-detail-page"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <AspirasiDetailPage id={resolvedParams.id} />
}
