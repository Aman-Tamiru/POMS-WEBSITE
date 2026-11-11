type PomsSectionHeadingProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    align?: "left" | "center";
    className?: string;
  };

  export default function PomsSectionHeading({
    eyebrow,
    title,
    description,
    align = "center",
    className = "",
  }: PomsSectionHeadingProps) {
    const centered = align === "center";

    return (
      <header
        className={`w-full ${centered ? "mx-auto text-center" : "text-left"} ${className}`}
      >
        {eyebrow && (
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--gold)] sm:text-xs">
            {eyebrow}
          </p>
        )}

        <h2 className="font-serif text-3xl font-normal leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h2>

        {description && (
          <p
            className={`mt-5 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)] sm:text-base ${
              centered ? "mx-auto" : ""
            }`}
          >
            {description}
          </p>
        )}

        <div
          className={`mt-7 flex items-center gap-2 ${
            centered ? "justify-center" : "justify-start"
          }`}
          aria-hidden="true"
        >
          <span className="h-px w-8 bg-[var(--gold)]" />
          <span className="h-1 w-1 rotate-45 bg-[var(--gold)]" />
          <span className="h-px w-8 bg-[var(--gold)]" />
        </div>
      </header>
    );
  }
