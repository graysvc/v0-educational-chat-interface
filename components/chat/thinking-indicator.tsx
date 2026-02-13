export function ThinkingIndicator() {
  return (
    <div className="flex w-fit items-center gap-2.5 rounded-2xl rounded-bl-md border border-border bg-card px-5 py-4">
      <span className="text-base text-muted-foreground md:text-lg">{"Pensando\u2026"}</span>
      <span className="flex gap-1.5">
        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
      </span>
    </div>
  )
}
