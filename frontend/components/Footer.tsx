import { Logo } from './Header';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="container-x flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo alwaysShowName />
          <p className="mt-3 max-w-sm text-sm text-zinc-500">
            On-chain licensing, inference credits and automated royalty splits for AI models.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/Next-ofkin/ai-model-royalty-protocol" target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.3-1.69-1.3-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
              </svg>
              GitHub repo
            </a>
            <a href="https://portfolio.dastrings.name.ng" target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2">
              Portfolio ↗
            </a>
          </div>
          <p className="text-sm text-zinc-500">
            Built by{' '}
            <a href="https://portfolio.dastrings.name.ng" target="_blank" rel="noreferrer" className="font-medium text-zinc-200 hover:text-white">
              Excel Shogbola
            </a>{' '}
            · © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
