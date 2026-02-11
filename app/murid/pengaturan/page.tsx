"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Bell, Lock, Moon, Sun, User } from "lucide-react"

export default function PengaturanPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Atur preferensi akun dan aplikasi Anda.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profil Pengguna</CardTitle>
            </div>
            <CardDescription>
              Informasi dasar akun Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" defaultValue="Alshin Murid" disabled />
                <p className="text-[0.8rem] text-muted-foreground">
                  Nama sesuai data sekolah. Hubungi admin untuk perubahan.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="murid@sakti.sch.id" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nisn">NISN</Label>
                <Input id="nisn" defaultValue="0012345678" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Kelas</Label>
                <Input id="class" defaultValue="XII RPL 1" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifikasi</CardTitle>
            </div>
            <CardDescription>
              Atur bagaimana Anda ingin menerima pemberitahuan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notif" className="flex flex-col space-y-1">
                <span>Notifikasi Email</span>
                <span className="font-normal text-muted-foreground">Terima update status aspirasi via email.</span>
              </Label>
              <Switch id="email-notif" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="push-notif" className="flex flex-col space-y-1">
                <span>Notifikasi Web</span>
                <span className="font-normal text-muted-foreground">Tampilkan pop-up saat aplikasi dibuka.</span>
              </Label>
              <Switch id="push-notif" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Simpan Preferensi</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Keamanan</CardTitle>
            </div>
            <CardDescription>
              Ubah kata sandi akun Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Kata Sandi Baru</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Ubah Kata Sandi</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
