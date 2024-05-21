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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  kode_proyek: z
    .string()
    .min(1, { message: "kode proyek tidak boleh kosong | contoh: PR-01" })
    .max(7, { message: "kode proyek tidak boleh lebih dari 7 karakter" }),
  nama_proyek: z.string().min(1, { message: "nama proyek tidak boleh kosong" }),
  tanggal_mulai: z
    .string()
    .min(1, { message: "tanggal mulai tidak boleh kosong" }),
  tanggal_selesai: z
    .string()
    .min(1, { message: "tanggal selesai tidak boleh kosong" }),
  isDone: z.boolean(),
  valuasi: z.string().min(1, { message: "valuasi tidak boleh kosong" }),
});

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

  const router = useRouter();
  const param = useParams().slug;
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_proyek: "",
      kode_proyek: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      isDone: false,
      valuasi: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: proyek, error: proyekError } = await supabase
        .from("projects")
        .select()
        .eq("id", param)
        .maybeSingle();

      if (proyekError) {
        console.error("Error fetching project:", proyekError);
        return;
      }

      form.reset({
        nama_proyek: proyek.nama_proyek,
        kode_proyek: proyek.kode_proyek,
        tanggal_mulai: proyek.tanggal_mulai,
        tanggal_selesai: proyek.tanggal_selesai,
        isDone: proyek.isDone,
        valuasi: proyek.valuasi,
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
        .from("projects")
        .update([
          {
            nama_proyek: values.nama_proyek,
            kode_proyek: values.kode_proyek,
            tanggal_mulai: values.tanggal_mulai,
            tanggal_selesai: values.tanggal_selesai,
            isDone: values.isDone,
            valuasi: `${values.valuasi}`,
          },
        ])
        .eq("id", param);

      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal!",
          description: "Edit proyek gagal.",
        });
        console.error("Error inserting data:", error);
        return;
      }

      toast({
        variant: "success",
        title: "Berhasil!",
        description: "Edit proyek berhasil.",
      });
      console.log("Data inserted successfully:", values);
      form.reset();
      router.push("/daftar-proyek");
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
            <CardTitle>Edit Proyek</CardTitle>
            <CardDescription>Edit proyek ID: {param}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="nama_proyek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Proyek</FormLabel>
                      <FormControl>
                        <Input placeholder="..." {...field} />
                      </FormControl>
                      <FormDescription>
                        e.g. Pembangunan Jalan di Dusun A
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kode_proyek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Proyek</FormLabel>
                      <FormControl>
                        <Input placeholder="PR-01" {...field} />
                      </FormControl>
                      <FormDescription>e.g. PR-01</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tanggal_mulai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Mulai</FormLabel>
                      <FormControl>
                        <Input placeholder="2021-07-01" {...field} />
                      </FormControl>
                      <FormDescription>e.g. 2021-07-01</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tanggal_selesai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Selesai</FormLabel>
                      <FormControl>
                        <Input placeholder="2021-07-31" {...field} />
                      </FormControl>
                      <FormDescription>e.g. 2021-07-31</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDone"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Status</FormLabel>
                        <FormDescription>
                          Ubah status terlaksana atau belum terlaksana. <br />
                          Status saat ini{" "}
                          {field.value ? "'Selesai'" : "'Belum Selesai'"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valuasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valuasi</FormLabel>
                      <FormControl>
                        <Input placeholder="9000000000" {...field} />
                      </FormControl>
                      <FormDescription>e.g. 9000000000</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2 xl:flex-row">
                  <Link href={"/daftar-proyek"}>
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
