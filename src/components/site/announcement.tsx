import Link from "next/link";

export function Announcement() {
  return (
    <div className="relative z-40 border-b border-ink bg-ink text-paper">
      <p className="micro px-4 py-2 text-center text-[10px] tracking-[0.22em]">
        Complimentary shipping from $150 · Gift wrap through the holidays ·{" "}
        <Link href="/shipping" className="underline">
          See dates
        </Link>
      </p>
    </div>
  );
}
