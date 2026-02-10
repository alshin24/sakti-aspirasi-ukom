import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { AspirasiCard } from "./aspirasi-card"
import type { Aspirasi } from "@/lib/supabase/queries"

interface AspirasiListProps {
  aspirasi: Aspirasi[]
  onViewDetail: (id: string) => void
  showSubmitter?: boolean
  emptyMessage?: string
}

export function AspirasiList({
  aspirasi,
  onViewDetail,
  showSubmitter = false,
  emptyMessage = "Belum ada aspirasi",
}: AspirasiListProps) {
  if (aspirasi.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {aspirasi.map((item) => (
        <AspirasiCard
          key={item.id}
          aspirasi={item}
          onViewDetail={onViewDetail}
          showSubmitter={showSubmitter}
        />
      ))}
    </div>
  )
}
