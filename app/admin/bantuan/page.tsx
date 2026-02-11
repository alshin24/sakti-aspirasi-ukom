import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileText, ShieldAlert, UserCog } from "lucide-react"

export default function BantuanAdminPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pusat Bantuan Admin</h1>
        <p className="text-muted-foreground">
          Dokumentasi dan panduan pengelolaan sistem SAKTI Aspirasi.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Manajemen Aspirasi
            </CardTitle>
            <CardDescription>
              Cara memproses aspirasi yang masuk.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="verif">
                <AccordionTrigger>Cara memverifikasi aspirasi baru</AccordionTrigger>
                <AccordionContent>
                  Buka menu "Kelola Aspirasi" &gt; "Semua Aspirasi". Klik pada aspirasi yang ingin diproses. 
                  Jika aspirasi valid, ubah status menjadi "Diproses" atau "Selesai". Jika tidak, pilih "Ditolak".
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tindak-lanjut">
                <AccordionTrigger>Cara memberikan tindak lanjut</AccordionTrigger>
                <AccordionContent>
                  Pada detail aspirasi, Anda dapat menambahkan balasan atau catatan internal. 
                  Pastikan untuk memberikan notifikasi kepada pengguna jika diperlukan.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              Manajemen Pengguna
            </CardTitle>
            <CardDescription>
              Mengelola data pengguna.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="manage-users">
                <AccordionTrigger>Mengelola Akun Pengguna</AccordionTrigger>
                <AccordionContent>
                  Masuk ke menu "Kelola Pengguna". Anda dapat melihat daftar semua pengguna yang terdaftar, 
                  mengedit role, atau menonaktifkan akun yang melanggar ketentuan.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Prosedur Keamanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <h3 className="font-semibold mb-2">Penanganan Konten Ilegal</h3>
            <p className="text-sm text-muted-foreground">
              Konten yang mengandung unsur kekerasan, pornografi, atau SARA harus segera dihapus dan 
              pengguna terkait dapat diblokir.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
