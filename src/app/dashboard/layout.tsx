"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = sessionStorage.getItem("lumiere_auth");
    if (!auth && pathname !== "/dashboard/login") {
      router.replace("/dashboard/login");
    } else {
      setChecking(false);
    }
  }, [pathname, router]);

  if (checking && pathname !== "/dashboard/login") {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="text-violet-400 text-sm">Verificando acceso...</div>
      </div>
    );
  }

  return <>{children}</>;
}
