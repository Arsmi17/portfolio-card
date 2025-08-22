import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { data: contacts, error } = await supabase
    .from("contact_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    // 1. Read the request body once
    const body = await request.json();
    const { username, email, message } = body;

    // 2. Validate the incoming data
    if (!username || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 3. Insert the new contact message into the database
    const { data: newContact, error: dbError } = await supabase
      .from("contact_responses")
      .insert({
        username,
        email,
        message,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 4. Send the email notification (wrapped in its own try/catch)
    try {
      // Fetch your email from the profiles table to use as the recipient
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .single(); // Assumes you have one profile entry

      if (profileError || !profileData?.email) {
        // Log the error but don't block the response. The main task (saving) is done.
        console.error("Could not fetch profile email for notification:", profileError?.message || "No email found in profiles table.");
      } else {
        // Send the email using Resend
        await resend.emails.send({
          from: 'onboarding@resend.dev', // IMPORTANT: Replace with your verified domain in Resend
          to: profileData.email, // Your email from the profiles table
          subject: `New Contact Response from ${username} at Portfolio`,
          html: `
            <h1>Get in Touch Response</h1>
            <p>You have a new message from your portfolio contact form:</p>
            <ul>
              <li><strong>Name:</strong> ${username}</li>
              <li><strong>Email:</strong> ${email}</li>
            </ul>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        });
      }
    } catch (emailError) {
      // Log any errors from Resend, but still return a success response to the user
      console.error("Resend email error:", emailError);
    }

    // 5. Return a success response to the client
    return NextResponse.json(newContact, { status: 201 });

  } catch (error) {
    // This catches errors if the request body is not valid JSON
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
