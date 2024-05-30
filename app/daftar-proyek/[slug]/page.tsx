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
import { createClient } from "@/utils/supabase/client";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, Key } from "react";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  type AlatInstance = {
    id: Key | number;
    project_id: number;
    tool_id: number;
    tools: {
      id: Key | number;
      nama_alat: string;
      kode_alat: string;
      merk: string;
      tahun_pembuatan: string;
      satuan: string;
      kapasitas: string | null;
      kondisi: string;
    };
  };

  const [proyek, setProyek] = useState<any>({});
  const [alatProyek, setAlatProyek] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const param = useParams().slug;
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch project data
      const { data: proyekData, error: proyekError } = await supabase
        .from("projects")
        .select()
        .eq("id", param)
        .maybeSingle();

      if (proyekError) {
        console.error("Error fetching project:", proyekError);
        return;
      }

      setProyek(proyekData);

      // Fetch alat proyek data
      const { data: alatProyekData, error: alatProyekError } = await supabase
        .from("tool_instances")
        .select("*, tools(*)")
        .eq("project_id", param);

      if (alatProyekError) {
        console.error("Error fetching tool instances:", alatProyekError);
        return;
      }

      setAlatProyek(alatProyekData);
      setLoading(false);
    };

    fetchData();
  }, [param]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const hapusAlatDiProyek = async (id: number | Key | string) => {
    const supabase = createClient();

    const {
      data: getSelectedToolInstance,
      error: getSelectedToolInstanceError,
    } = await supabase
      .from("tool_instances")
      .select()
      .eq("id", id)
      .maybeSingle();

    if (getSelectedToolInstanceError) {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Hapus alat di proyek ini gagal.",
      });
      console.error("Error inserting data:", getSelectedToolInstanceError);
      return;
    }

    const { data: getSelectedTool, error: getSelectedToolError } =
      await supabase
        .from("tools")
        .select()
        .eq("id", parseInt(getSelectedToolInstance.tool_id))
        .maybeSingle();

    if (getSelectedToolError) {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Hapus alat di proyek ini gagal.",
      });
      console.error("Error inserting data:", getSelectedToolError);
      return;
    }

    const { error: updateToolError } = await supabase
      .from("tools")
      .update({
        jumlah_sekarang: parseInt(getSelectedTool.jumlah_sekarang) + 1,
        jumlah_terpakai: parseInt(getSelectedTool.jumlah_terpakai) - 1,
      })
      .eq("id", parseInt(getSelectedTool.id));

    if (updateToolError) {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Hapus alat di proyek ini gagal.",
      });
      console.error("Error updating data:", updateToolError);
      return;
    }

    const { error } = await supabase
      .from("tool_instances")
      .delete()
      .match({ id });

    if (error) {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Hapus alat di proyek ini gagal.",
      });
      console.error("Error deleting alat:", error.message);
    }

    toast({
      variant: "success",
      title: "Berhasil!",
      description: "Hapus alat di proyek ini berhasil.",
    });
    window.location.reload();
  };

  return (
    <div className="flex flex-col flex-1 gap-20 p-5">
      <main className="flex flex-col flex-1 gap-6">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Detail Proyek</CardTitle>
            <CardDescription>
              Informasi detail mengenai proyek ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <div className="font-medium">Nama Proyek</div>
                <div>{proyek.nama_proyek}</div>
              </div>
              <div className="flex flex-col">
                <div className="font-medium">Kode Proyek</div>
                <div>{proyek.kode_proyek}</div>
              </div>
              <div className="flex flex-col">
                <div className="font-medium">Tanggal Mulai</div>
                <div>{proyek.tanggal_mulai}</div>
              </div>
              <div className="flex flex-col">
                <div className="font-medium">Tanggal Selesai</div>
                <div>{proyek.tanggal_selesai}</div>
              </div>
              <div className="flex flex-col">
                <div className="font-medium">Status</div>
                <div>
                  {proyek.isDone ? (
                    <Badge variant="default">Selesai</Badge>
                  ) : (
                    <Badge variant="secondary">Belum Selesai</Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-medium">Valuasi</div>
                <div>{formatCurrency(proyek.valuasi)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Link href={`/daftar-proyek/${param}/tambah-alat`}>
          <Button className="w-full">Tambah Alat di proyek ini</Button>
        </Link>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Daftar Alat</CardTitle>
            <CardDescription>
              Daftar Alat-alat yang ada di proyek ini.
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
                  {/* <TableHead className="hidden xl:table-cell">Jumlah</TableHead> */}
                  <TableHead className="hidden xl:table-cell">Satuan</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Kapasitas
                  </TableHead>
                  <TableHead className="text-right">Kondisi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alatProyek && alatProyek.length > 0 ? (
                  alatProyek.map((alatInstance: AlatInstance) => (
                    <TableRow
                      className="border-b bg-accent dark:border-b-zinc-800"
                      key={alatInstance.id}
                    >
                      <TableCell className="flex gap-2 text-left">
                        <Button
                          variant={"destructive"}
                          onClick={() => hapusAlatDiProyek(alatInstance.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {alatInstance.tools.nama_alat}
                        </div>
                        {/* <div className="hidden text-sm text-muted-foreground md:inline">
                          liam@example.com
                        </div> */}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {alatInstance.tools.kode_alat}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {alatInstance.tools.merk}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {alatInstance.tools.tahun_pembuatan}
                      </TableCell>

                      <TableCell className="hidden xl:table-cell">
                        {alatInstance.tools.satuan}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {alatInstance.tools.kapasitas || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {alatInstance.tools.kondisi === "Baik" ? (
                          <Badge className="text-xs" variant="secondary">
                            {alatInstance.tools.kondisi}
                          </Badge>
                        ) : (
                          <Badge className="text-xs" variant="destructive">
                            {alatInstance.tools.kondisi}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Tidak ada alat di proyek ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
