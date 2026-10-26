import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-background px-6 py-8 md:px-12">
      <div className="mx-auto grid max-w-[90rem] grid-cols-[auto_1fr] items-center gap-x-6 gap-y-5 md:grid-cols-[1fr_auto_1fr]">
        <a href="#top" aria-label={site.shortName} className="flex items-center gap-3 text-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="h-7 w-auto" />
          <span className="label !tracking-[0.35em]">{site.shortName}</span>
        </a>

        <ul className="flex flex-wrap justify-end gap-x-4 gap-y-2 text-[0.6875rem] text-muted md:order-3 md:gap-x-8 md:text-xs">
          {site.social.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="col-span-2 text-center text-[0.6875rem] text-muted md:order-2 md:col-span-1 md:text-xs">
          © {new Date().getFullYear()} {site.companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
