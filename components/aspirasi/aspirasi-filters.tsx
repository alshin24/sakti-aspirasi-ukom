import { Button } from "@/components/ui/button"
import type { AspirasiStatus } from "@/lib/supabase/queries"

interface AspirasiFiltersProps {
  currentFilter: "all" | AspirasiStatus
  onFilterChange: (filter: "all" | AspirasiStatus) => void
  counts: {
    all: number
    pending: number
    approved: number
    rejected: number
  }
}

export function AspirasiFilters({ currentFilter, onFilterChange, counts }: AspirasiFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={currentFilter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
      >
        Semua ({counts.all})
      </Button>
      <Button
        variant={currentFilter === "pending" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("pending")}
      >
        Pending ({counts.pending})
      </Button>
      <Button
        variant={currentFilter === "approved" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("approved")}
      >
        Disetujui ({counts.approved})
      </Button>
      <Button
        variant={currentFilter === "rejected" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("rejected")}
      >
        Ditolak ({counts.rejected})
      </Button>
    </div>
  )
}
