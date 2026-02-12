"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExportDialog } from "@/components/admin/export-dialog"

export default function MoreAdminPage() {
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Menu Lainnya</h1>
            <p className="text-muted-foreground">
            Alat tambahan admin.
            </p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dashboard
            </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => setExportDialogOpen(true)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5 text-primary" />
              Ekspor Laporan
            </CardTitle>
            <CardDescription>
              Unduh data aspirasi dalam format CSV/Excel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Unduh Sekarang</Button>
          </CardContent>
        </Card>
      </div>

      <ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
    </div>
  )
}
