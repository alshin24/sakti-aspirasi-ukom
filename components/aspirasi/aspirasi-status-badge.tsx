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
        <Badge variant="outline" className="border-yellow-300 text-yellow-700">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="outline" className="border-green-300 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Disetujui
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="border-red-300 text-red-700">
          <XCircle className="w-3 h-3 mr-1" />
          Ditolak
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}
