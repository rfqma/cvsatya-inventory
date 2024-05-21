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
import { Edit, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  type Alat = {
    id: number;
    nama_alat: string;
    kode_alat: string;
    merk: string;
    tahun_pembuatan: string;
    jumlah: number;
    jumlah_sekarang: number;
    satuan: string;
    kapasitas: string | null;
    kondisi: string;
  };

  const [alatGudang, setAlatGudang] = useState<Alat[]>([]);
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

      const { data: alatGudang, error: alatGudangError } = await supabase
        .from("tools")
        .select();

      if (alatGudangError) {
        console.error("Error fetching alat gudang:", alatGudangError);
        return;
      }

      setAlatGudang(alatGudang);
      setLoading(false);
    };

    fetchUserAndData();
  }, [router]);

  const hapusAlat = async (id: number) => {
    const supabase = createClient();
    const { error } = await supabase.from("tools").delete().match({ id });
    if (error) {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Hapus alat di gudang gagal.",
      });
      console.error("Error deleting alat:", error.message);
    }

    toast({
      variant: "success",
      title: "Berhasil!",
      description: "Hapus alat di gudang berhasil.",
    });
    router.refresh();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col flex-1 gap-20 p-5">
      <main className="flex flex-col flex-1 gap-6">
        <Link href={"/daftar-alat/tambah"} className="w-28">
          <Button className="w-28">Tambah Alat</Button>
        </Link>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Daftar Alat</CardTitle>
            <CardDescription>
              Daftar Alat-alat yang ada di gudang.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b dark:border-b-zinc-800">
                  <TableHead className="text-left">Aksi</TableHead>
                  <TableHead>Nama Alat</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Kode Alat
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">Merk</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Tahun Pembuatan
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">Jumlah</TableHead>
                  <TableHead className="hidden xl:table-cell">Satuan</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Kapasitas
                  </TableHead>
                  <TableHead className="text-right">Kondisi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alatGudang &&
                  alatGudang.map((alat: Alat) => {
                    return (
                      <TableRow
                        className="border-b bg-accent dark:border-b-zinc-800"
                        key={alat.id}
                      >
                        <TableCell className="flex gap-2 text-left">
                          <Link href={`/daftar-alat/edit/${alat.id}`}>
                            <Button variant={"secondary"}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant={"destructive"}
                            onClick={() => hapusAlat(alat.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{alat.nama_alat}</div>
                          {/* <div className="hidden text-sm text-muted-foreground md:inline">
                          liam@example.com
                        </div> */}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {alat.kode_alat}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {alat.merk}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {alat.tahun_pembuatan}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {alat.jumlah_sekarang}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {alat.satuan}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {alat.kapasitas || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {alat.kondisi === "Baik" ? (
                            <Badge className="text-xs" variant="secondary">
                              {alat.kondisi}
                            </Badge>
                          ) : (
                            <Badge className="text-xs" variant="destructive">
                              {alat.kondisi}
                            </Badge>
                          )}
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
