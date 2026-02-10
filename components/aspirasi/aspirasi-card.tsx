import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { AspirasiStatusBadge } from "./aspirasi-status-badge"
import { AspirasiCategoryBadge } from "./aspirasi-category-badge"
import type { Aspirasi } from "@/lib/supabase/queries"

interface AspirasiCardProps {
  aspirasi: Aspirasi
  onViewDetail: (id: string) => void
  showSubmitter?: boolean
}

export function AspirasiCard({ aspirasi, onViewDetail, showSubmitter = false }: AspirasiCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{aspirasi.title}</CardTitle>
            <CardDescription className="flex flex-col gap-1 mt-1">
              {showSubmitter && aspirasi.submitter && (
                <span>
                  {aspirasi.submitter.nama || aspirasi.submitter.email}
                  {aspirasi.submitter.nis && <span className="text-xs"> (NIS: {aspirasi.submitter.nis})</span>}
                </span>
              )}
              <span className="flex items-center gap-2">
                <span>
                  {new Date(aspirasi.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                {aspirasi.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {aspirasi.location}
                    </span>
                  </>
                )}
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <AspirasiCategoryBadge category={aspirasi.category} />
            <AspirasiStatusBadge status={aspirasi.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{aspirasi.content}</p>
        <Button variant="outline" size="sm" onClick={() => onViewDetail(aspirasi.id)}>
          Lihat Detail
        </Button>
      </CardContent>
    </Card>
  )
}
