import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient() // Corrected line
  const { id } = params
  const {
    title,
    description,
    youtube_link,
    project_url,
    category,
    is_featured,
  } = await request.json()

  const { data, error } = await supabase
    .from('projects')
    .update({
      title,
      description,
      youtube_link,
      project_url,
      category,
      is_featured,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json(
      { error: 'Project not found or update failed due to permissions.' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient() // Corrected line
  const { id } = params

  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json(
      { error: 'Project not found or delete failed due to permissions.' },
      { status: 404 }
    )
  }

  return NextResponse.json({ message: 'Project deleted successfully', deletedProject: data })
}