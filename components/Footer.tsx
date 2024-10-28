import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <Link href="https://warpcast.com/papa" className="footer__logo">
            <Image
              width={1200}
              height={200}
              src="/logo.svg"
              alt="Papa"
              priority
            />
          </Link>
        </div>
        <div className="footer__bottom">
          <div className="footer__copir">
            <span>
              <a
                href="https://bit.ly/papaspotify"
                target="_blank"
                rel="noreferrer"
              >
                🎧
              </a>
            </span>{" "}
          </div>
        </div>
      </div>
    </footer>
  );
}
