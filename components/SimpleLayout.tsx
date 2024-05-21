// import DeployButton from "../components/DeployButton";
// import AuthButton from "../components/AuthButton";
// import { createClient } from "@/utils/supabase/server";
import { ModeToggle } from "./theme-mode-toggle";
import Link from "next/link";
import {
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Search,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export default function SimpleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const canInitSupabaseClient = () => {
  //   // This function is just for the interactive tutorial.
  //   // Feel free to remove it once you have Supabase connected.
  //   try {
  //     createClient();
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // };

  // const isSupabaseConnected = canInitSupabaseClient();

  const [daftarProyekBelumSelesaiLength, setDaftarProyekBelumSelesaiLength] =
    useState(0);
  const [alatGudangLength, setAlatGudangLength] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUser(user);
      }

      const { data: alatGudang, error: alatGudangError } = await supabase
        .from("tools")
        .select();

      if (alatGudangError) {
        console.error("Error fetching alat gudang:", alatGudangError);
        return;
      }

      setAlatGudangLength(alatGudang?.length);

      const {
        data: daftarProyekBelumSelesai,
        error: daftarProyekBelumSelesaiError,
      } = await supabase.from("projects").select().eq("isDone", false);

      if (daftarProyekBelumSelesaiError) {
        console.error(
          "Error fetching daftar proyek belum selesai:",
          daftarProyekBelumSelesaiError
        );
        return;
      }

      setDaftarProyekBelumSelesaiLength(daftarProyekBelumSelesai?.length);
    };

    fetchData();
  });

  const logOut = async () => {
    const supabase = createClient();
    supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r dark:border-r-zinc-800 border-r-zinc-200 bg-muted/40 md:block">
        <div className="flex flex-col h-full max-h-screen gap-2">
          <div className="flex h-14 items-center border-b dark:border-b-zinc-800 border-b-zinc-200 px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="text-sm">Pendataan Peralatan CV Satya</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/daftar-alat"
                className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg bg-muted text-primary hover:text-primary"
              >
                <Package className="w-4 h-4" />
                Daftar Alat{" "}
                <Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
                  {alatGudangLength}
                </Badge>
              </Link>
              <Link
                href="/daftar-proyek"
                className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary"
              >
                <Users className="w-4 h-4" />
                Daftar Proyek
                <Badge className="flex items-center justify-center w-6 h-6 ml-auto bg-blue-800 rounded-full shrink-0">
                  {daftarProyekBelumSelesaiLength}
                </Badge>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary"
              >
                <LineChart className="w-4 h-4" />
                Analytics
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-1 p-4 mt-auto">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Petunjuk</CardTitle>
                {/* <CardDescription></CardDescription> */}
              </CardHeader>
              <CardContent className="flex flex-col gap-2 p-2 pt-0 md:p-4 md:pt-0">
                {/* <Button size="sm" className="w-full">
                  Upgrade
                </Button> */}
                <div className="flex items-center gap-2">
                  <Badge className="flex items-center justify-center w-5 h-5 bg-blue-800 rounded-full shrink-0"></Badge>
                  <span className="text-xs">Proyek yang belum selesai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="flex items-center justify-center w-5 h-5 rounded-full shrink-0"></Badge>
                  <span className="text-xs">Total alat</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b dark:border-b-zinc-800 border-b-zinc-200 bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex flex-col border-r dark:border-r-zinc-800 border-r-zinc-200"
            >
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <span className="sr-only">Inventaris CV Satya</span>
                </Link>
                <Link
                  href="/"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  href="/daftar-alat"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="w-5 h-5" />
                  Daftar Alat
                  <Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
                    {alatGudangLength}
                  </Badge>
                </Link>
                <Link
                  href="/daftar-proyek"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="w-5 h-5" />
                  Daftar Proyek
                  <Badge className="flex items-center justify-center w-6 h-6 ml-auto bg-blue-800 rounded-full dark:bg-blue-800 shrink-0">
                    {daftarProyekBelumSelesaiLength}
                  </Badge>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="w-5 h-5" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                <Card x-chunk="dashboard-02-chunk-0">
                  <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle>Petunjuk</CardTitle>
                    {/* <CardDescription></CardDescription> */}
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 p-2 pt-0 md:p-4 md:pt-0">
                    {/* <Button size="sm" className="w-full">
                  Upgrade
                </Button> */}
                    <div className="flex items-center gap-2">
                      <Badge className="flex items-center justify-center w-5 h-5 bg-blue-800 rounded-full dark:bg-blue-800 shrink-0"></Badge>
                      <span className="text-xs">Proyek yang belum selesai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="flex items-center justify-center w-5 h-5 rounded-full shrink-0"></Badge>
                      <span className="text-xs">Total alat</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 w-full">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-8 shadow-none appearance-none bg-background md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="w-5 h-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {currentUser ? currentUser.email : "not logged in!"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Settings</DropdownMenuItem>
              <DropdownMenuItem disabled>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => logOut()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {/* <main className="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
          </div>
          <div
            className="flex items-center justify-center flex-1 border border-dashed rounded-lg shadow-sm" x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no products
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start selling as soon as you add a product.
              </p>
              <Button className="mt-4">Add Product</Button>
            </div>
          </div>
        </main> */}
        {children}
        <Toaster />

        <footer className="flex justify-center w-full p-8 text-xs text-center border-t dark:border-t-zinc-200/10 border-t-zinc-200">
          <p>
            &copy; Copyright by{" "}
            <a
              href="https://rifqimaulana.xyz"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Rifqi Maulana
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
