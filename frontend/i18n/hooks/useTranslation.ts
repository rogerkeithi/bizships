import { useI18n } from "../provider";

export function useTranslation() {
  const { dictionary } = useI18n();

  return dictionary;
}
