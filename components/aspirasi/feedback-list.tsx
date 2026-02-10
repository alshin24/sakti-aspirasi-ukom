import { MessageSquare } from "lucide-react"
import type { Feedback } from "@/lib/supabase/queries"

interface FeedbackListProps {
  feedback: Feedback[]
  emptyMessage?: string
}

export function FeedbackList({ feedback, emptyMessage = "Belum ada feedback dari admin" }: FeedbackListProps) {
  if (feedback.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {feedback.map((fb) => (
        <div key={fb.id} className="border-l-4 border-primary pl-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {fb.admin?.nama || fb.admin?.email || "Admin"}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(fb.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{fb.content}</p>
        </div>
      ))}
    </div>
  )
}
