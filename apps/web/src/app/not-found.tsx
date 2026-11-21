import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container page-pad">
      <p className="eyebrow">404</p>
      <h1>
        Denne siden finnes ikke.
        <br />
        This page does not exist.
      </h1>
      <Link className="button" href="/">
        Vastu Nord →
      </Link>
    </main>
  );
}
