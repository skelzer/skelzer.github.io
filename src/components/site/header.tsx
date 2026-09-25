import { MenuIcon, MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { nav } from "@/data/cv"
import { useTheme } from "@/hooks/use-theme"

export function Header() {
  const { theme, toggle } = useTheme()
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode"

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-3 sm:px-7">
        <a href="#top" className="group flex items-center gap-2.5 font-heading text-[15px] font-extrabold tracking-[.02em] no-underline">
          <span className="inline-block size-2 bg-signal transition-transform group-hover:rotate-45" />
          MIGUEL&nbsp;LUQUE
        </a>

        <div className="flex items-center gap-2 sm:gap-5">
          <nav aria-label="Sections" className="hidden gap-5 md:flex">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="relative font-mono text-xs tracking-[.06em] text-muted-foreground uppercase no-underline after:absolute after:-bottom-[3px] after:left-0 after:h-0.5 after:w-0 after:bg-signal after:transition-[width] hover:text-foreground hover:after:w-full"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={toggle} aria-label={label} />}>
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </TooltipTrigger>
            <TooltipContent side="bottom">{label}</TooltipContent>
          </Tooltip>

          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-background p-6">
              <SheetTitle className="font-mono text-xs tracking-[.08em] text-muted-foreground uppercase">
                Sections
              </SheetTitle>
              <nav aria-label="Sections" className="mt-2 flex flex-col">
                {nav.map((n) => (
                  <SheetClose
                    key={n.id}
                    nativeButton={false}
                    render={<a href={`#${n.id}`} />}
                    className="border-b py-3 font-heading text-lg font-bold uppercase no-underline hover:text-signal"
                  >
                    {n.label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
