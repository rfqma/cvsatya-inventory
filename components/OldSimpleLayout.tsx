import { ModeToggle } from "./theme-mode-toggle";

export const OldSimpleLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <nav className="flex justify-center w-full h-16 border-b dark:border-b-zinc-200/10 border-b-zinc-200">
        <div className="flex items-center justify-between w-full max-w-4xl p-3 text-sm">
          {/* <DeployButton /> */}
          <span className="font-bold">Inventaris CV Satya</span>
          <div className="flex gap-5">
            <ModeToggle />
            {/* {isSupabaseConnected && <AuthButton />} */}
          </div>
        </div>
      </nav>

      {children}

      <footer className="flex justify-center w-full p-8 text-xs text-center border-t dark:border-t-zinc-200/10 border-t-zinc-200">
        <p>
          &copy; Copyright by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            <a href="https://rifqimaulana.xyz" target="_blank">
              Rifqi Maulana
            </a>
          </a>
        </p>
      </footer>
    </>
  );
};
