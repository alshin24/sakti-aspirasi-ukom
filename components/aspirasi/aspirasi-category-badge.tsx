import { Badge } from "@/components/ui/badge"
import type { AspirasiCategory } from "@/lib/supabase/queries"

interface AspirasiCategoryBadgeProps {
  category: AspirasiCategory
}

export function AspirasiCategoryBadge({ category }: AspirasiCategoryBadgeProps) {
  const colors: Record<AspirasiCategory, string> = {
    fasilitas: "border-blue-300 text-blue-700",
    akademik: "border-purple-300 text-purple-700",
    ekstrakurikuler: "border-green-300 text-green-700",
    lainnya: "border-gray-300 text-gray-700",
  }

  return (
    <Badge variant="outline" className={colors[category]}>
      {category}
    </Badge>
  )
}
