import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  // No need for cookie check here, middleware handles it.
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest) {
  const supabase = createClient();
  // No need for cookie check here, middleware handles it.
  try {
    const body = await request.json();
    const { name, bio, avatar, social, cv_url } = body;

    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
      .single();

    if (fetchError || !existingProfile) {
      const { data, error } = await supabase
        .from("profiles")
        .insert({ name, bio, avatar_url: avatar, social, cv_url })
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        name,
        bio,
        avatar_url: avatar,
        social,
        cv_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingProfile.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}