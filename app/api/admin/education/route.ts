import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// GET - Fetch all education for admin
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

    // Fetch all education
    const { data: education, error } = await supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching education:', error);
      return NextResponse.json(
        { error: 'Failed to fetch education' },
        { status: 500 }
      );
    }

    return NextResponse.json({ education: education || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/education:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new education
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
    const { degree, institution, location, start_date, end_date, description } = body;

    // Validate required fields
    if (!degree || !institution || !start_date) {
      return NextResponse.json(
        { error: 'Missing required fields: degree, institution, start_date' },
        { status: 400 }
      );
    }

    // Use service role for admin operations
    const serviceSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await serviceSupabase
      .from('education')
      .insert([{
        degree,
        institution,
        location,
        start_date,
        end_date: end_date || null,
        description
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating education:', error);
      return NextResponse.json(
        { error: 'Failed to create education' },
        { status: 500 }
      );
    }

    return NextResponse.json({ education: data });
  } catch (error) {
    console.error('Error in POST /api/admin/education:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update education
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
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { degree, institution, location, start_date, end_date, description } = body;

    // Use service role for admin operations
    const serviceSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await serviceSupabase
      .from('education')
      .update({
        degree,
        institution,
        location,
        start_date,
        end_date: end_date || null,
        description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating education:', error);
      return NextResponse.json(
        { error: 'Failed to update education' },
        { status: 500 }
      );
    }

    return NextResponse.json({ education: data });
  } catch (error) {
    console.error('Error in PUT /api/admin/education:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove education
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
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }

    // Use service role for admin operations to bypass RLS
    const serviceSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await serviceSupabase
      .from('education')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting education:', error);
      return NextResponse.json(
        { error: 'Failed to delete education' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/education:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
