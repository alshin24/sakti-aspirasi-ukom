import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquarePlus } from "lucide-react"

export function MuridSubmitCTA() {
  const router = useRouter()

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquarePlus className="w-5 h-5" />
          Punya Aspirasi Baru?
        </CardTitle>
        <CardDescription>
          Sampaikan ide atau keluhan Anda untuk kemajuan sekolah
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => router.push("/murid/kirim-aspirasi")} className="w-full">
          Kirim Aspirasi Sekarang
        </Button>
      </CardContent>
    </Card>
  )
}
