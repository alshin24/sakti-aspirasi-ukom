import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import type { AspirasiStatus } from "@/lib/supabase/queries"

interface AspirasiStatusBadgeProps {
  status: AspirasiStatus
}

export function AspirasiStatusBadge({ status }: AspirasiStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <div className="inline-flex items-center rounded-full border-2 border-black bg-yellow-300 px-3 py-1 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          Pending
        </div>
      )
    case "approved":
      return (
        <div className="inline-flex items-center rounded-full border-2 border-black bg-green-400 px-3 py-1 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          Disetujui
        </div>
      )
    case "rejected":
      return (
        <div className="inline-flex items-center rounded-full border-2 border-black bg-red-400 px-3 py-1 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <XCircle className="w-3.5 h-3.5 mr-1.5" />
          Ditolak
        </div>
      )
    default:
      return <Badge>{status}</Badge>
  }
}
