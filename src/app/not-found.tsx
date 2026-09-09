import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <p className="micro">404</p>
      <h1 className="display mt-3 text-6xl">That piece is not in the archive.</h1>
      <Link href="/shop" className="micro mt-8 inline-block underline">
        Shop what’s here
      </Link>
    </div>
  );
}
