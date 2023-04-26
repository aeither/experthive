export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with{" "}
            <a
              href={"https://example.com"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              FVM
            </a>
            {" "}and{" "}
            <a
              href={"https://example.com"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Huddle01
            </a>
            . The source code is available on{" "}
            <a
              href={"https://example.com"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
