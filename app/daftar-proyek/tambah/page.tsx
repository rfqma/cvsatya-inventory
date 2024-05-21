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
  const router = useRouter();
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if (values !== null) {
      const supabase = createClient();
      const { error } = await supabase.from("projects").insert([
        {
          nama_proyek: values.nama_proyek,
          kode_proyek: values.kode_proyek,
          tanggal_mulai: values.tanggal_mulai,
          tanggal_selesai: values.tanggal_selesai,
          isDone: false,
          valuasi: `${values.valuasi}`,
        },
      ]);
      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal!",
          description: "Tambah proyek gagal.",
        });
        console.error("Error inserting data:", error);
        return;
      }

      toast({
        variant: "success",
        title: "Berhasil!",
        description: "Tambah proyek berhasil.",
      });
      console.log("Data inserted successfully:", values);
      form.reset();
      router.push("/daftar-proyek");
    } else {
      console.log("values:", values);
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-20 p-5">
      <main className="flex flex-col flex-1 gap-6">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Tambah Proyek</CardTitle>
            <CardDescription>Tambah proyek baru ke database.</CardDescription>
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
