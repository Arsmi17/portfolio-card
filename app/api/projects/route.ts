import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const body = await request.json();
    const {
      title,
      quick_description,
      full_description,
      youtube_link,
      project_url,
      category,
      is_featured,
    } = body;

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        title,
        quick_description,
        full_description,
        youtube_link,
        project_url,
        category,
        is_featured: is_featured || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}