import Link from "next/link";

export default function Footer({ name }: { name?: string }) {
  return (
    <footer className="border-t border-vc-border px-5 py-4 text-center">
      {name && (
        <p className="text-[11px] text-vc-text-ghost mb-3">
          Keep going, {name}. You&apos;re building the future. ❤️
        </p>
      )}
      <div className="flex justify-center items-center gap-3 text-[11px] text-vc-text-ghost">
        <Link href="/privacy" className="hover:text-vc-cyan transition-colors no-underline text-vc-text-ghost">
          Privacy Policy
        </Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-vc-cyan transition-colors no-underline text-vc-text-ghost">
          Terms of Service
        </Link>
      </div>
      <p className="text-[10px] text-vc-text-ghost mt-2 opacity-60">
        © {new Date().getFullYear()} VibeyCoder. All rights reserved.
      </p>
    </footer>
  );
}
