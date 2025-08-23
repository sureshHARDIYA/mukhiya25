import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// GET - Fetch all skills for admin (including inactive)
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all skills (including inactive ones for admin)
    const { data: skills, error } = await supabase
      .from('skills')
      .select('*')
      .order('category_name', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching skills:', error);
      return NextResponse.json(
        { error: 'Failed to fetch skills' },
        { status: 500 }
      );
    }

    return NextResponse.json({ skills: skills || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new skill
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { category_name, skill_name, skill_level, color, sort_order } = body;

    // Validate required fields
    if (!category_name || !skill_name || skill_level === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use service role for admin operations
    const serviceSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await serviceSupabase
      .from('skills')
      .insert([{
        category_name,
        skill_name,
        skill_level,
        color: color || '#3B82F6',
        sort_order: sort_order || 0,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating skill:', error);
      return NextResponse.json(
        { error: 'Failed to create skill' },
        { status: 500 }
      );
    }

    return NextResponse.json({ skill: data });
  } catch (error) {
    console.error('Error in POST /api/admin/skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update skill
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { category_name, skill_name, skill_level, color, sort_order } = body;

    // Use service role for admin operations
    const serviceSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await serviceSupabase
      .from('skills')
      .update({
        category_name,
        skill_name,
        skill_level,
        color,
        sort_order,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating skill:', error);
      return NextResponse.json(
        { error: 'Failed to update skill' },
        { status: 500 }
      );
    }

    return NextResponse.json({ skill: data });
  } catch (error) {
    console.error('Error in PUT /api/admin/skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove skill
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // Use service role for admin operations to bypass RLS
    const serviceSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await serviceSupabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting skill:', error);
      return NextResponse.json(
        { error: 'Failed to delete skill' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
