"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getAllProfiles, Profile } from "@/lib/supabase/queries"
import { Search } from "lucide-react"

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const data = await getAllProfiles()
        setProfiles(data)
      } catch (error) {
        console.error("Failed to fetch profiles:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [])

  const filteredProfiles = profiles.filter((profile) =>
    (profile.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (profile.nis || "").includes(searchTerm)
  )

  return (
    <div className="container mx-auto py-8">
       <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Kelola Pengguna</CardTitle>
                <CardDescription>Daftar semua pengguna yang terdaftar di sistem.</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari user (nama, email, nis)..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="text-center py-4">Loading users...</div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>NIS</TableHead>
                        <TableHead>Bergabung</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredProfiles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                Tidak ada pengguna ditemukan.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredProfiles.map((profile) => (
                            <TableRow key={profile.id}>
                                <TableCell className="font-medium">{profile.nama || "-"}</TableCell>
                                <TableCell>{profile.email}</TableCell>
                                <TableCell>
                                    <Badge variant={profile.role === "admin" || profile.role === "master" ? "default" : "secondary"}>
                                        {profile.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>{profile.nis || "-"}</TableCell>
                                <TableCell>{new Date(profile.created_at).toLocaleDateString("id-ID")}</TableCell>
                            </TableRow>
                        ))
                    )}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
