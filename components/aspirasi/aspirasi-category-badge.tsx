import { Badge } from "@/components/ui/badge"
import type { AspirasiCategory } from "@/lib/supabase/queries"

interface AspirasiCategoryBadgeProps {
  category: AspirasiCategory
}

export function AspirasiCategoryBadge({ category }: AspirasiCategoryBadgeProps) {
  const styles: Record<AspirasiCategory, string> = {
    fasilitas: "bg-blue-300",
    akademik: "bg-purple-300",
    ekstrakurikuler: "bg-emerald-300",
    lainnya: "bg-gray-200",
  }

  return (
    <div
      className={`inline-flex items-center rounded-lg border-2 border-black px-2.5 py-0.5 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider ${
        styles[category] || "bg-gray-200"
      }`}
    >
      {category}
    </div>
  )
}
