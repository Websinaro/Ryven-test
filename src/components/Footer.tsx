import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-background px-6 py-8 md:px-12">
      <div className="mx-auto flex max-w-[90rem] flex-col items-center gap-6 md:flex-row md:justify-between">
        <a href="#top" aria-label={site.shortName} className="flex items-center gap-3 text-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="h-7 w-auto" />
          <span className="label !tracking-[0.35em]">{site.shortName}</span>
        </a>

        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {site.companyName}. All rights reserved.
        </p>

        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-muted">
          {site.social.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
