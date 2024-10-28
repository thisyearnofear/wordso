import { useTranslation } from "hooks/use-translations";
import Link from "next/link";

export default function NotFound() {
  const translation = useTranslation();

  return (
    <div className="b404">
      <div className="b404__title">404</div>
      <div className="b404__text">{translation.not_found}</div>
      <Link href="/" className="b404__btn">
        {translation.mainpage}
      </Link>
    </div>
  );
}

NotFound.noLayout = true;
