import { Suspense } from "react";

import { LoginPageClient } from "@/domains/auth/components/LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageClient />
    </Suspense>
  );
}
