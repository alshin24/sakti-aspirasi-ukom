import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar } from "lucide-react"
import { AspirasiStatusBadge } from "./aspirasi-status-badge"
import { AspirasiCategoryBadge } from "./aspirasi-category-badge"
import type { Aspirasi } from "@/lib/supabase/queries"

interface AspirasiDetailViewProps {
  aspirasi: Aspirasi
  showSubmitter?: boolean
}

export function AspirasiDetailView({ aspirasi, showSubmitter = false }: AspirasiDetailViewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <AspirasiCategoryBadge category={aspirasi.category} />
              <AspirasiStatusBadge status={aspirasi.status} />
            </div>
            <CardTitle className="text-2xl">{aspirasi.title}</CardTitle>
            <CardDescription className="flex flex-col gap-1 mt-2">
              {showSubmitter && aspirasi.submitter && (
                <span>
                  Oleh: {aspirasi.submitter.nama || aspirasi.submitter.email}
                  {aspirasi.submitter.nis && <span className="text-xs"> (NIS: {aspirasi.submitter.nis})</span>}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Dikirim: {new Date(aspirasi.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {aspirasi.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {aspirasi.location}
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-sm">{aspirasi.content}</p>
        </div>
      </CardContent>
    </Card>
  )
}
