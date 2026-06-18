import { Suspense } from "react";

import { ConfirmEmailPageClient } from "@/domains/auth/components/ConfirmEmailPageClient";

export default function ConfirmEmailPage() {
  return (
    <Suspense>
      <ConfirmEmailPageClient />
    </Suspense>
  );
}
