import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRight, ExternalLink, FileText, Info, Shield, Users } from "lucide-react"

export default function MorePage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Lainnya</h1>
        <p className="text-muted-foreground">
          Informasi tambahan dan tautan berguna.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer group">
          <Link href="/about" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <Info className="h-5 w-5" />
                Tentang Aplikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Pelajari lebih lanjut tentang SAKTI Aspirasi, visi, dan misi kami dalam membangun lingkungan sekolah yang lebih baik.
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                Selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors cursor-pointer group">
          <Link href="/privacy" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <Shield className="h-5 w-5" />
                Kebijakan Privasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                Baca Kebijakan <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Link>
        </Card>

         <Card className="hover:bg-muted/50 transition-colors cursor-pointer group">
          <Link href="/terms" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <FileText className="h-5 w-5" />
                Syarat & Ketentuan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Aturan dan ketentuan penggunaan layanan SAKTI Aspirasi yang harus dipatuhi.
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                Baca Syarat <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors cursor-pointer group">
          <a href="https://sakti.sch.id" target="_blank" rel="noopener noreferrer" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <ExternalLink className="h-5 w-5" />
                Website Sekolah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Kunjungi website resmi sekolah untuk informasi akademik dan berita terbaru.
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                Buka Website <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </a>
        </Card>
      </div>
      
      <div className="flex justify-center mt-8">
        <p className="text-xs text-muted-foreground">
            Versi Aplikasi 1.0.0 &copy; 2026 SAKTI Aspirasi
        </p>
      </div>
    </div>
  )
}
