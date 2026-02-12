import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Image as ImageIcon } from "lucide-react"
import { AspirasiStatusBadge } from "./aspirasi-status-badge"
import { AspirasiCategoryBadge } from "./aspirasi-category-badge"
import type { Aspirasi } from "@/lib/supabase/queries"
import { useState } from "react"

interface AspirasiCardProps {
  aspirasi: Aspirasi
  onViewDetail: (id: string) => void
  showSubmitter?: boolean
}

export function AspirasiCard({ aspirasi, onViewDetail, showSubmitter = false }: AspirasiCardProps) {
  const [showImageModal, setShowImageModal] = useState(false)

  return (
    <>
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{aspirasi.title}</CardTitle>
              <CardDescription className="flex flex-col gap-1 mt-1">
                {showSubmitter && aspirasi.submitter && (
                  <span>
                    {aspirasi.submitter.nama || aspirasi.submitter.email}
                    {aspirasi.submitter.nis && <span className="text-xs"> (NIS: {aspirasi.submitter.nis})</span>}
                  </span>
                )}
                <span className="flex items-center gap-2 flex-wrap">
                  <span>
                    {new Date(aspirasi.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {aspirasi.location && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {aspirasi.location}
                      </span>
                    </>
                  )}
                </span>
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <AspirasiCategoryBadge category={aspirasi.category} />
              <AspirasiStatusBadge status={aspirasi.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{aspirasi.content}</p>
          
          {aspirasi.image_url && (
            <div className="mb-3">
              <img 
                src={aspirasi.image_url} 
                alt={aspirasi.title}
                className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowImageModal(true)}
              />
            </div>
          )}

          <Button variant="outline" size="sm" onClick={() => onViewDetail(aspirasi.id)}>
            Lihat Detail
          </Button>
        </CardContent>
      </Card>

      {/* Image Modal */}
      {showImageModal && aspirasi.image_url && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={aspirasi.image_url} 
              alt={aspirasi.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <Button
              variant="secondary"
              className="absolute top-4 right-4"
              onClick={() => setShowImageModal(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
