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
import { Globe, Lock, Mail, Settings } from "lucide-react"

export default function PengaturanAdminPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Admin</h1>
        <p className="text-muted-foreground">
          Konfigurasi sistem admin dan preferensi akun.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle>Preferensi</CardTitle>
            </div>
            <CardDescription>
              Pengaturan antarmuka dan notifikasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notif" className="flex flex-col space-y-1">
                <span>Notifikasi Email</span>
                <span className="font-normal text-muted-foreground">
                  Terima email saat ada aspirasi baru.
                </span>
              </Label>
              <Switch id="email-notif" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
               <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span>Tema Gelap</span>
                <span className="font-normal text-muted-foreground">
                  Gunakan tampilan gelap untuk aplikasi.
                </span>
              </Label>
              <Switch id="dark-mode" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Simpan Perubahan</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Keamanan Akun</CardTitle>
            </div>
            <CardDescription>
              Ubah kata sandi akun admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-pass">Kata Sandi Lama</Label>
              <Input id="current-pass" type="password" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-pass">Kata Sandi Baru</Label>
                <Input id="new-pass" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-pass">Konfirmasi Kata Sandi</Label>
                <Input id="confirm-pass" type="password" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Update Password</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
