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
                  Buka menu "Aspirasi Masuk" di dashboard. Klik pada aspirasi yang berstatus "Menunggu". 
                  Review isinya, jika layak tayang/proses, klik tombol "Terima" atau "Proses". Jika melanggar aturan, klik "Tolak" dan berikan alasannya.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tindak-lanjut">
                <AccordionTrigger>Cara memberikan tindak lanjut</AccordionTrigger>
                <AccordionContent>
                  Pada detail aspirasi yang sedang diproses, Anda dapat menambahkan komentar atau mengubah status menjadi "Selesai". 
                  Pastikan bukti penyelesaian (foto/dokumen) dilampirkan jika ada.
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
              Mengelola data murid dan admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="add-admin">
                <AccordionTrigger>Menambah Admin Baru</AccordionTrigger>
                <AccordionContent>
                  Masuk ke menu "Kelola Admin" &gt; "Tambah Admin". Isi formulir dengan data lengkap. 
                  Sistem akan mengirimkan kredensial login ke email yang didaftarkan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reset-pass">
                <AccordionTrigger>Reset Password Murid</AccordionTrigger>
                <AccordionContent>
                  Cari nama murid di menu "Daftar Murid". Klik ikon "Edit" atau "Reset Password". 
                  Password sementara akan digenerate otomatis.
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
            Prosedur Darurat & Keamanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <h3 className="font-semibold mb-2">Laporan Penyalahgunaan</h3>
            <p className="text-sm text-muted-foreground">
              Jika ditemukan aspirasi yang mengandung unsur SARA, Kekerasan, atau Pornografi, segera ubah status menjadi "Ditolak" 
              dan ban akun pengguna terkait jika perlu melalui menu "Daftar Murid".
            </p>
          </div>
          <div className="rounded-md bg-muted p-4">
            <h3 className="font-semibold mb-2">Backup Data</h3>
            <p className="text-sm text-muted-foreground">
              Sistem melakukan backup otomatis setiap hari pukul 02:00 WIB. Untuk backup manual, 
              hubungi tim IT support pusat.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
