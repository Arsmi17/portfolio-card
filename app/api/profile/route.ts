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

// export async function PUT(request: NextRequest) {
//   const supabase = createClient();
//   // No need for cookie check here, middleware handles it.
//   try {
//     const body = await request.json();
//     const { name, bio, avatar, social, cv_url, email, contact } = body;

//     const { data: existingProfile, error: fetchError } = await supabase
//       .from("profiles")
//       .select("id")
//       .limit(1)
//       .single();

//     if (fetchError || !existingProfile) {
//       const { data, error } = await supabase
//         .from("profiles")
//         .insert({ name, bio, avatar_url: avatar, social, cv_url })
//         .select()
//         .single();
//       if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//       return NextResponse.json(data);
//     }

//     const { data, error } = await supabase
//       .from("profiles")
//       .update({
//         name,
//         bio,
//         avatar_url: avatar,
//         social,
//         cv_url,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", existingProfile.id)
//       .select()
//       .single();

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
//   }
// }

export async function PUT(request: NextRequest) {
  const supabase = createClient();

  try {
    const body = await request.json();
    const { name, bio, avatar, social, cv_url, contact, email } = body;

    // Safely parse social JSON
    let socialData: Record<string, string> = {};
    if (social) {
      if (typeof social === "string") {
        try {
          socialData = JSON.parse(social);
        } catch {
          return NextResponse.json({ error: "Invalid social JSON" }, { status: 400 });
        }
      } else if (typeof social === "object") {
        socialData = social;
      } else {
        return NextResponse.json({ error: "Invalid social format" }, { status: 400 });
      }
    }

    // Check if profile exists
    const userId = 1;
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();


    if (fetchError && fetchError.code !== "PGRST116") {
      // Unexpected error
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!existingProfile) {
      // Insert new profile
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          name,
          bio,
          avatar_url: avatar,
          social: socialData,
          cv_url,
          contact,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    // Update existing profile
    const { data, error } = await supabase
    .from("profiles")
    .update({
      name,
      bio,
      avatar_url: avatar,
      social: socialData,
      cv_url,
      contact,
      email,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId) // filter by unique id
    .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
