import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LifeBuoy, Mail, MessageCircle, Phone } from "lucide-react"

export default function BantuanPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pusat Bantuan</h1>
        <p className="text-muted-foreground">
          Temukan jawaban atas pertanyaan Anda atau hubungi kami untuk bantuan lebih lanjut.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>FAQ (Pertanyaan Umum)</CardTitle>
            <CardDescription>
              Jawaban untuk pertanyaan yang sering diajukan oleh siswa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Bagaimana cara mengirim aspirasi?</AccordionTrigger>
                <AccordionContent>
                  Anda dapat mengirim aspirasi dengan menekan tombol "Ajukan Aspirasi" di sidebar, 
                  lalu pilih "Aspirasi Baru". Isi formulir yang tersedia dengan detail aspirasi Anda 
                  dan klik "Kirim".
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Apakah aspirasi saya bersifat anonim?</AccordionTrigger>
                <AccordionContent>
                  Secara default, identitas Anda tercatat oleh sistem untuk keperluan verifikasi. 
                  Namun, Anda dapat memilih opsi "Kirim sebagai Anonim" jika tersedia pada formulir 
                  untuk menyembunyikan identitas Anda dari publik.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Berapa lama aspirasi saya akan ditanggapi?</AccordionTrigger>
                <AccordionContent>
                  Waktu tanggapan bervariasi tergantung pada jenis aspirasi dan beban kerja admin. 
                  Biasanya, Anda akan menerima tanggapan awal dalam waktu 1-3 hari kerja.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Bagaimana cara melihat status aspirasi saya?</AccordionTrigger>
                <AccordionContent>
                  Anda dapat memantau status aspirasi Anda di menu "Aspirasi Saya". Status akan 
                  diperbarui secara real-time saat ada tindak lanjut dari pihak sekolah.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Hubungi Kami</CardTitle>
              <CardDescription>
                Masih butuh bantuan? Kirim pesan langsung kepada kami.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subjek</Label>
                  <Input id="subject" placeholder="Misal: Kendala teknis saat upload foto" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea
                    id="message"
                    placeholder="Jelaskan masalah atau pertanyaan Anda secara detail..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Mail className="mr-2 h-4 w-4" /> Kirim Pesan
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontak Langsung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Telepon Sekolah</p>
                  <p className="text-sm text-muted-foreground">(021) 1234-5678</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">WhatsApp Admin</p>
                  <p className="text-sm text-muted-foreground">0812-3456-7890</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <LifeBuoy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pusat Informasi</p>
                  <p className="text-sm text-muted-foreground">Ruang TU, Gedung A Lt. 1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
