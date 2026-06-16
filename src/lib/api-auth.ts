import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AdminProfile {
  id: string;
  nome: string;
  email: string;
  tipo: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email || "" };
}

export async function requireAuth(): Promise<{ user: AuthUser } | NextResponse> {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return { user };
}

export async function requireAdmin(): Promise<{ user: AuthUser; profile: AdminProfile } | NextResponse> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nome, email, tipo")
    .eq("id", user.id)
    .single();

  if (!profile || profile.tipo !== "admin") {
    return NextResponse.json({ error: "Acesso restrito a administradores" }, { status: 403 });
  }

  return {
    user: { id: user.id, email: user.email || "" },
    profile: profile as AdminProfile,
  };
}

export function isErrorResponse(result: unknown): result is NextResponse {
  return result instanceof NextResponse;
}
