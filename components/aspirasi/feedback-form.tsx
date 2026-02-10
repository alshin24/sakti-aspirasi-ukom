"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addFeedback } from "@/lib/supabase/queries"

interface FeedbackFormProps {
  aspirasiId: string
  adminId: string
  onSuccess: () => void
  onError: (error: string) => void
}

export function FeedbackForm({ aspirasiId, adminId, onSuccess, onError }: FeedbackFormProps) {
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!content.trim()) {
      onError("Feedback tidak boleh kosong")
      return
    }

    setSubmitting(true)

    try {
      await addFeedback({
        aspirasi_id: aspirasiId,
        admin_id: adminId,
        content: content.trim(),
      })

      setContent("")
      onSuccess()
    } catch (err: any) {
      onError(err.message || "Gagal menambahkan feedback")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Tulis feedback atau komentar..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="resize-none"
      />
      <Button type="submit" disabled={submitting || !content.trim()}>
        {submitting ? "Mengirim..." : "Kirim Feedback"}
      </Button>
    </form>
  )
}
