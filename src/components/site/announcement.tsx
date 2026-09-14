import Link from "next/link";

export function Announcement() {
  return (
    <div className="relative z-40 border-b border-line bg-paper">
      <p className="micro px-4 py-2 text-center text-[10px] tracking-[0.16em] text-muted">
        Complimentary shipping from $150 ·{" "}
        <Link href="/shipping" className="text-ink underline underline-offset-4">
          See dates
        </Link>
      </p>
    </div>
  );
}
