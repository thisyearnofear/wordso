import { useRouter } from "next/router";

export function useLocale() {
  const router = useRouter();
  const locale = router.locale ?? "en";
  const isRTL = ["ar", "he", "fa"].includes(locale); // Add RTL languages if needed

  return {
    locale,
    isRTL,
    changeLocale: (newLocale: string) => {
      void router.push(router.pathname, router.asPath, { locale: newLocale });
    },
  };
}
