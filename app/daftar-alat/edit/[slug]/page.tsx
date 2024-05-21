"use client";

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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, Key } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  kode_alat: z
    .string()
    .min(1, { message: "kode alat tidak boleh kosong | contoh: AB-01" })
    .max(7, { message: "kode alat tidak boleh lebih dari 7 karakter" }),
  nama_alat: z.string().min(1, { message: "nama alat tidak boleh kosong" }),
  merk: z.string().min(1, { message: "merk tidak boleh kosong" }),
  tahun_pembuatan: z
    .string()
    .min(4, { message: "tahun pembuatan tidak boleh kosong" })
    .max(4, { message: "tahun pembuatan tidak valid" }),
  satuan: z.string().min(1, { message: "satuan tidak boleh kosong" }),
  kapasitas: z.string().nullable(),
  kondisi: z.enum(["Baik", "Perbaikan", "Rusak"]),
  jumlah_awal: z.preprocess(
    (a) => parseInt(z.string().parse(a)),
    z.number().positive().min(1, { message: "jumlah tidak boleh kosong" })
  ),
  // jumlah_sekarang: z.preprocess(
  //   (a) => parseInt(z.string().parse(a)),
  //   z.number().positive().min(1, { message: "jumlah tidak boleh kosong" })
  // ),
  jumlah_sekarang: z.string(),
  // jumlah_terpakai: z.preprocess(
  //   (a) => parseInt(z.string().parse(a)),
  //   z.number().positive().min(1, { message: "jumlah tidak boleh kosong" })
  // ),
  jumlah_terpakai: z.string(),
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

  const router = useRouter();
  const param = useParams().slug;
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [jumlahAwalSebelumEdit, setJumlahAwalSebelumEdit] = useState("");
  const [jumlahSekarangSebelumEdit, setJumlahSekarangSebelumEdit] =
    useState("");
  const [jumlahTerpakaiSebelumEdit, setJumlahTerpakaiSebelumEdit] =
    useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_alat: "",
      kode_alat: "",
      merk: "",
      tahun_pembuatan: "",
      satuan: "",
      kapasitas: null,
      kondisi: "Baik",
      jumlah_awal: 0,
      jumlah_sekarang: "0",
      jumlah_terpakai: "0",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: alat, error: alatError } = await supabase
        .from("tools")
        .select()
        .eq("id", param)
        .maybeSingle();

      if (alatError) {
        console.error("Error fetching project:", alatError);
        return;
      }

      setJumlahAwalSebelumEdit(alat.jumlah_awal);
      setJumlahSekarangSebelumEdit(alat.jumlah_sekarang);
      setJumlahTerpakaiSebelumEdit(alat.jumlah_terpakai);

      form.reset({
        nama_alat: alat.nama_alat,
        kode_alat: alat.kode_alat,
        merk: alat.merk,
        tahun_pembuatan: alat.tahun_pembuatan,
        satuan: alat.satuan,
        kapasitas: alat.kapasitas,
        kondisi: alat.kondisi as "Baik" | "Perbaikan" | "Rusak" | undefined,
        jumlah_awal: alat.jumlah_awal,
        jumlah_sekarang: alat.jumlah_sekarang,
        jumlah_terpakai: alat.jumlah_terpakai,
      });

      setLoading(false);
    };

    fetchData();
  }, [param]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if (values !== null) {
      const supabase = createClient();

      const { error } = await supabase
        .from("tools")
        .update([
          {
            nama_alat: values.nama_alat,
            kode_alat: values.kode_alat,
            merk: values.merk,
            tahun_pembuatan: values.tahun_pembuatan,
            satuan: values.satuan,
            kapasitas: values.kapasitas,
            kondisi: values.kondisi,
            jumlah_awal: values.jumlah_awal,
            jumlah_sekarang:
              parseInt(values.jumlah_sekarang) +
              (values.jumlah_awal - parseInt(jumlahAwalSebelumEdit)),
            jumlah_terpakai: values.jumlah_terpakai,
          },
        ])
        .eq("id", param);

      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal!",
          description: "Edit alat di gudang gagal.",
        });
        console.error("Error inserting data:", error);
        return;
      }

      toast({
        variant: "success",
        title: "Berhasil!",
        description: "Edit alat di gudang berhasil.",
      });
      console.log("Data inserted successfully:", values);
      form.reset();
      router.push("/daftar-alat");
    } else {
      console.log("values:", values);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col flex-1 gap-20 p-5">
      <main className="flex flex-col flex-1 gap-6">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Edit Alat</CardTitle>
            <CardDescription>Edit alat ID: {param}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="nama_alat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Alat</FormLabel>
                      <FormControl>
                        <Input placeholder="Palu" {...field} />
                      </FormControl>
                      <FormDescription>e.g. Palu</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kode_alat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Alat</FormLabel>
                      <FormControl>
                        <Input placeholder="AB-01" {...field} />
                      </FormControl>
                      <FormDescription>e.g. AB-01</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="merk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merk</FormLabel>
                      <FormControl>
                        <Input placeholder="Krisbow" {...field} />
                      </FormControl>
                      <FormDescription>e.g. Krisbow</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tahun_pembuatan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun Pembuatan</FormLabel>
                      <FormControl>
                        <Input placeholder="2010" {...field} />
                      </FormControl>
                      <FormDescription>e.g. 2010</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="satuan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Satuan</FormLabel>
                      <FormControl>
                        <Input placeholder="Buah" {...field} />
                      </FormControl>
                      <FormDescription>e.g. Buah</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kapasitas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapasitas</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1 Ton"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>e.g. 1 Ton</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kondisi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kondisi</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kondisi alat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baik">Baik</SelectItem>
                          <SelectItem value="Perbaikan">Perbaikan</SelectItem>
                          <SelectItem value="Rusak">Rusak</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        pilih salah satu kondisi alat saat ini
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jumlah_awal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Awal</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>e.g. 10</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jumlah_sekarang"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Sekarang</FormLabel>
                      <FormControl>
                        <Input disabled type="number" {...field} />
                      </FormControl>
                      <FormDescription>e.g. 10</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jumlah_terpakai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Terpakai</FormLabel>
                      <FormControl>
                        <Input disabled type="number" {...field} />
                      </FormControl>
                      <FormDescription>e.g. 10</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2 xl:flex-row">
                  <Link href={"/daftar-alat"}>
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
