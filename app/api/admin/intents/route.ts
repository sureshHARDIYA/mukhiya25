// app/api/admin/intents/route.ts
import { supabaseAdmin } from '@/lib/supabase';
import { validateAdminAccess, validateAdminIP, rateLimit } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Middleware-like function to handle auth and rate limiting
function withAdminAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // IP validation
    const ipError = validateAdminIP(req);
    if (ipError) return ipError;

    // API key validation
    const authError = validateAdminAccess(req);
    if (authError) return authError;

    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`admin:${clientIP}`, 20, 60000)) { // 20 requests per minute
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    return handler(req);
  };
}

// GET - List all intents
export const GET = withAdminAuth(async () => {
  try {
    const { data: intents, error } = await supabaseAdmin
      .from('intents')
      .select('*')
      .order('id');

    if (error) throw error;

    return NextResponse.json({ intents });
  } catch (error) {
    console.error('Error fetching intents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch intents' },
      { status: 500 }
    );
  }
});

// POST - Create new intent
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, description, confidence_threshold } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const { data: intent, error } = await supabaseAdmin
      .from('intents')
      .insert([{
        name: name.toUpperCase(),
        description,
        confidence_threshold: confidence_threshold || 0.6
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ intent }, { status: 201 });
  } catch (error) {
    console.error('Error creating intent:', error);
    return NextResponse.json(
      { error: 'Failed to create intent' },
      { status: 500 }
    );
  }
});

// PUT - Update existing intent
export const PUT = withAdminAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { id, name, description, confidence_threshold } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Intent ID is required' },
        { status: 400 }
      );
    }

    const { data: intent, error } = await supabaseAdmin
      .from('intents')
      .update({
        name: name?.toUpperCase(),
        description,
        confidence_threshold
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ intent });
  } catch (error) {
    console.error('Error updating intent:', error);
    return NextResponse.json(
      { error: 'Failed to update intent' },
      { status: 500 }
    );
  }
});

// DELETE - Remove intent
export const DELETE = withAdminAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Intent ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('intents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Intent deleted successfully' });
  } catch (error) {
    console.error('Error deleting intent:', error);
    return NextResponse.json(
      { error: 'Failed to delete intent' },
      { status: 500 }
    );
  }
});
