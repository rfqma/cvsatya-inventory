"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  tool_id: z.string(),
  project_id: z.string(),
});

export default function Page() {
  type Alat = {
    id: number;
    nama_alat: string;
    kode_alat: string;
    merk: string;
    tahun_pembuatan: string;
    satuan: string;
    kapasitas: string | null;
    kondisi: string;
    jumlah_awal: number;
    jumlah_sekarang: number;
    jumlah_terpakai: number;
  };

  const param = useParams().slug;
  const project_id = param;
  const router = useRouter();
  const [alatGudang, setAlatGudang] = useState<Alat[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: alatGudang, error: alatGudangError } = await supabase
        .from("tools")
        .select();

      if (alatGudangError) {
        console.error("Error fetching alat gudang:", alatGudangError);
        return;
      }

      setAlatGudang(alatGudang);
    };

    fetchData();
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: project_id.toString(),
      tool_id: "0",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if (values !== null) {
      const supabase = createClient();

      const { error } = await supabase.from("tool_instances").insert([
        {
          project_id: parseInt(project_id.toString()),
          tool_id: parseInt(values.tool_id),
        },
      ]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal!",
          description: "Tambah alat di proyek ini gagal.",
        });
        console.error("Error inserting data:", error);
        return;
      }

      const { data: getSelectedTool, error: getSelectedToolError } =
        await supabase
          .from("tools")
          .select()
          .eq("id", parseInt(values.tool_id))
          .maybeSingle();

      if (getSelectedToolError) {
        toast({
          variant: "destructive",
          title: "Gagal!",
          description: "Tambah alat di proyek ini gagal.",
        });
        console.error("Error inserting data:", getSelectedToolError);
        return;
      }

      const { error: updateToolError } = await supabase
        .from("tools")
        .update({
          jumlah_sekarang: parseInt(getSelectedTool.jumlah_sekarang) - 1,
          jumlah_terpakai: parseInt(getSelectedTool.jumlah_terpakai) + 1,
        })
        .eq("id", parseInt(values.tool_id));

      if (updateToolError) {
        toast({
          variant: "destructive",
          title: "Gagal!",
          description: "Tambah alat di proyek ini gagal.",
        });
        console.error("Error updating data:", updateToolError);
        return;
      }

      toast({
        variant: "success",
        title: "Berhasil!",
        description: "Tambah alat di proyek ini berhasil.",
      });
      console.log("Data inserted successfully:", values);
      form.reset();
      router.push(`/daftar-proyek/${project_id}`);
    } else {
      console.log("values:", values);
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-20 p-5">
      <main className="flex flex-col flex-1 gap-6">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Tambah Alat</CardTitle>
            <CardDescription>
              Tambah alat di proyek ID: {project_id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="tool_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alat</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih alat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {alatGudang &&
                            alatGudang.map((alat) => {
                              return (
                                <SelectItem value={alat.id.toString()}>
                                  {alat.nama_alat}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                      <FormDescription>pilih salah satu alat.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2 xl:flex-row">
                  <Link href={`/daftar-proyek/${project_id}`}>
                    <Button type="submit" variant={"outline"}>
                      Batal
                    </Button>
                  </Link>

                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
