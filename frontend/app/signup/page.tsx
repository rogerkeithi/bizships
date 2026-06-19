import { Suspense } from "react";

import { SignupPageClient } from "@/domains/auth/components/SignupPageClient";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupPageClient />
    </Suspense>
  );
}
