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
import { useRouter } from "next/navigation";
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
  jumlah: z.preprocess(
    (a) => parseInt(z.string().parse(a)),
    z.number().positive().min(1, { message: "jumlah tidak boleh kosong" })
  ),
});

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();

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
      jumlah: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if (values !== null) {
      const supabase = createClient();
      const { data, error } = await supabase.from("tools").insert([
        {
          nama_alat: values.nama_alat,
          kode_alat: values.kode_alat,
          merk: values.merk,
          tahun_pembuatan: values.tahun_pembuatan,
          satuan: values.satuan,
          kapasitas: values.kapasitas,
          kondisi: values.kondisi,
          jumlah_awal: values.jumlah,
          jumlah_sekarang: values.jumlah,
        },
      ]);
      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal!",
          description: "Tambah alat di gudang gagal.",
        });
        console.log("Error inserting data:", error);
        return;
      }
      toast({
        variant: "success",
        title: "Berhasil!",
        description: "Tambah alat di gudang berhasil.",
      });
      console.log("Data inserted successfully:", values);
      form.reset();
      router.push("/daftar-alat");
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
            <CardDescription>Tambah alat baru ke dalam gudang.</CardDescription>
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
                  name="jumlah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
