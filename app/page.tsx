import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: alatGudang } = await supabase.from("tools").select();
  const { data: daftarProyek } = await supabase.from("projects").select();
  const { data: daftarProyekSelesai } = await supabase
    .from("projects")
    .select()
    .eq("isDone", true);

  const { data: allJumlahTerpakai } = await supabase
    .from("tools")
    .select("jumlah_terpakai");

  const jumlahTerpakai = allJumlahTerpakai?.reduce(
    (accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.jumlah_terpakai, 10);
    },
    0
  );

  const { data: allJumlahAwal } = await supabase
    .from("tools")
    .select("jumlah_awal");

  const jumlahAwal = allJumlahAwal?.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.jumlah_awal, 10);
  }, 0);

  const { data: allJumlahSekarang } = await supabase
    .from("tools")
    .select("jumlah_sekarang");

  const jumlahSekarang = allJumlahSekarang?.reduce(
    (accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.jumlah_sekarang, 10);
    },
    0
  );

  return (
    <div className="flex flex-col flex-1 gap-20 p-5">
      <main className="grid items-start flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid items-start gap-4 auto-rows-max md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <Image
                  src={"/logo-name-alamat.jpg"}
                  alt="logo-name-alamat.jpg"
                  width={300}
                  height={300}
                  className="mb-4 rounded-lg"
                />
                <CardTitle>Pendataan Peralatan CV Satya</CardTitle>
                <CardDescription className="max-w-lg leading-relaxed text-balance">
                  Aplikasi Inventaris CV Satya adalah aplikasi yang digunakan
                  untuk mengelola data inventaris barang yang ada di CV Satya.
                </CardDescription>
              </CardHeader>
              {/* <CardFooter>
                <Button>Create New Order</Button>
              </CardFooter> */}
            </Card>
            <Card
              x-chunk="dashboard-05-chunk-1"
              className="flex flex-col justify-between"
            >
              <CardHeader className="pb-2">
                <CardDescription>Jumlah Proyek</CardDescription>
                <CardTitle className="text-4xl">
                  {daftarProyek?.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {daftarProyekSelesai?.length} Selesai
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={
                    daftarProyekSelesai && daftarProyek
                      ? (daftarProyekSelesai?.length / daftarProyek?.length) *
                        100
                      : null
                  }
                  aria-label="25% increase"
                />
              </CardFooter>
            </Card>
            <Card
              x-chunk="dashboard-05-chunk-2"
              className="flex flex-col justify-between"
            >
              <CardHeader className="pb-2">
                <CardDescription>Jumlah Alat di Gudang</CardDescription>
                <CardTitle className="text-4xl">{alatGudang?.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Total {jumlahAwal} kuantitas alat
                </div>
                <div className="text-xs text-muted-foreground">
                  Total {jumlahSekarang} kuantitas alat sisa
                </div>
                <div className="text-xs text-muted-foreground">
                  Total {jumlahTerpakai} kuantitas alat terpakai
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={
                    jumlahTerpakai && jumlahAwal
                      ? (jumlahTerpakai / jumlahAwal) * 100
                      : null
                  }
                  aria-label="12% increase"
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
