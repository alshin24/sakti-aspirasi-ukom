import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, CheckCircle2, MessageSquarePlus, User } from "lucide-react"

export default function PanduanPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Panduan Penggunaan</h1>
        <p className="text-muted-foreground">
          Tutorial lengkap cara menggunakan aplikasi SAKTI Aspirasi.
        </p>
      </div>

      <Tabs defaultValue="aspirasi" className="space-y-4">
        <TabsList>
          <TabsTrigger value="aspirasi">Mengirim Aspirasi</TabsTrigger>
          <TabsTrigger value="pantau">Memantau Status</TabsTrigger>
          <TabsTrigger value="profil">Mengelola Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="aspirasi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquarePlus className="h-5 w-5 text-primary" />
                Cara Mengirim Aspirasi
              </CardTitle>
              <CardDescription>
                Langkah-langkah untuk menyampaikan ide, keluhan, atau saran Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-medium">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Buka Menu "Ajukan Aspirasi"</p>
                  <p className="text-sm text-muted-foreground">
                    Pada sidebar di sebelah kiri, klik menu "Ajukan Aspirasi" kemudian pilih "Aspirasi Baru".
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-medium">
                  2
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Isi Judul dan Kategori</p>
                  <p className="text-sm text-muted-foreground">
                    Masukkan judul yang singkat namun jelas. Pilih kategori yang paling sesuai (misal: Sarana Prasarana, Kurikulum, dll).
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-medium">
                  3
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Deskripsikan Aspirasi Anda</p>
                  <p className="text-sm text-muted-foreground">
                    Jelaskan detail aspirasi Anda di kolom deskripsi. Sertakan lokasi, waktu kejadian, atau detail relevan lainnya.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-medium">
                  4
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Unggah Bukti (Opsional)</p>
                  <p className="text-sm text-muted-foreground">
                    Jika ada, lampirkan foto atau dokumen pendukung untuk memperkuat aspirasi Anda.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-medium">
                  5
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Kirim</p>
                  <p className="text-sm text-muted-foreground">
                    Periksa kembali data yang Anda masukkan, lalu klik tombol "Kirim Aspirasi".
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pantau" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Memantau Status Aspirasi
              </CardTitle>
              <CardDescription>
                Fahami arti dari setiap status aspirasi Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="font-medium">Menunggu</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Aspirasi telah diterima sistem dan sedang menunggu verifikasi dari admin.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                  <span className="font-medium">Diproses</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Aspirasi sedang ditindaklanjuti oleh pihak terkait.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium">Selesai</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Aspirasi telah diselesaikan dan ditutup.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-red-500" />
                  <span className="font-medium">Ditolak</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Aspirasi tidak dapat diproses (misal: data tidak lengkap, mengandung SARA, dll).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Mengelola Profil
              </CardTitle>
              <CardDescription>
                Cara mengubah informasi akun Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Untuk saat ini, perubahan data sensitif seperti Nama dan NISN harus dilakukan melalui
                bagian Tata Usaha untuk memastikan validitas data siswa.
              </p>
              <p className="text-sm text-muted-foreground">
                Anda dapat mengubah foto profil dan kata sandi melalui menu <strong>Pengaturan</strong> di sidebar.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
