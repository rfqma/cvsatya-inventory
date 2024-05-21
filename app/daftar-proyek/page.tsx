"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  type Proyek = {
    id: number;
    nama_proyek: string;
    kode_proyek: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    valuasi: string;
    isDone: boolean;
  };

  const [daftarProyek, setDaftarProyek] = useState<Proyek[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndData = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: daftarProyek, error: daftarProyekError } = await supabase
        .from("projects")
        .select();

      if (daftarProyekError) {
        console.error("Error fetching alat gudang:", daftarProyekError);
        return;
      }

      setDaftarProyek(daftarProyek);
      setLoading(false);
    };

    fetchUserAndData();
  }, [router]);

  const hapusProyek = async (id: number) => {
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().match({ id });
    if (error) {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Hapus proyek gagal.",
      });
      console.error("Error deleting proyek:", error.message);
    }

    toast({
      variant: "success",
      title: "Berhasil!",
      description: "Hapus proyek berhasil.",
    });
    router.refresh();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col flex-1 gap-20 p-5">
      <main className="flex flex-col flex-1 gap-6">
        <Link href={"/daftar-proyek/tambah"} className="w-32">
          <Button className="w-32">Tambah Proyek</Button>
        </Link>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Daftar Proyek</CardTitle>
            <CardDescription>
              Daftar Proyek yang belum atau sudah terlaksana.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b dark:border-b-zinc-800">
                  <TableHead className="text-left">Aksi</TableHead>
                  <TableHead>Nama Proyek</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Kode Proyek
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Tanggal Mulai
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Tanggal Selesai
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">Status</TableHead>
                  <TableHead className="text-right">Valuasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daftarProyek &&
                  daftarProyek.map((proyek: Proyek) => {
                    return (
                      <TableRow
                        className="border-b bg-accent dark:border-b-zinc-800"
                        key={proyek.id}
                      >
                        <TableCell className="flex gap-2 text-left">
                          <Link href={`/daftar-proyek/${proyek.id}`}>
                            <Button variant={"default"}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>

                          <Link href={`/daftar-proyek/edit/${proyek.id}`}>
                            <Button variant={"secondary"}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>

                          <Button
                            variant={"destructive"}
                            onClick={() => hapusProyek(proyek.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {proyek.nama_proyek}
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {proyek.kode_proyek}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {proyek.tanggal_mulai}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {proyek.tanggal_selesai}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {proyek.isDone ? (
                            <Badge className="text-xs" variant="default">
                              Selesai
                            </Badge>
                          ) : (
                            <Badge className="text-xs" variant="secondary">
                              Belum Selesai
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(proyek.valuasi)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
