import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const cookieStore = cookies();
  const adminSession = cookieStore.get("admin_session");

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If not admin, filter for published blogs only
  if (adminSession?.value !== "authenticated") {
    return NextResponse.json(blogs.filter((b) => b.is_published));
  }

  return NextResponse.json(blogs);
}

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const body = await request.json();
    const {
      title,
      description,
      content,
      image_url,
      category,
      is_published,
    } = body;

    const { data: blog, error } = await supabase
      .from("blogs")
      .insert({
        title,
        description,
        content,
        image_url,
        category,
        is_published: is_published || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}