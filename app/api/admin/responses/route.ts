// app/api/admin/responses/route.ts
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAccess } from '@/lib/auth';

// GET - List all responses with intent information
export async function GET(request: NextRequest) {
  // Check admin authentication
  const authError = validateAdminAccess(request);
  if (authError) return authError;

  try {
    const { data: responses, error } = await supabaseAdmin
      .from('responses')
      .select(`
        *,
        intents (
          id,
          name,
          description
        )
      `)
      .order('id');

    if (error) throw error;

    return NextResponse.json({ responses });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    );
  }
}

// POST - Create new response
export async function POST(req: NextRequest) {
  // Check admin authentication
  const authError = validateAdminAccess(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { 
      intent_id, 
      trigger_patterns, 
      response_text, 
      response_type, 
      response_data,
      follow_up_questions 
    } = body;

    // Validate required fields
    if (!intent_id || !response_text || !response_type) {
      return NextResponse.json(
        { error: 'intent_id, response_text, and response_type are required' },
        { status: 400 }
      );
    }

    const { data: response, error } = await supabaseAdmin
      .from('responses')
      .insert([{
        intent_id,
        trigger_patterns: trigger_patterns || [],
        response_text,
        response_type,
        response_data: response_data || null,
        follow_up_questions: follow_up_questions || []
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json(
      { error: 'Failed to create response' },
      { status: 500 }
    );
  }
}

// PUT - Update existing response
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      id, 
      intent_id, 
      trigger_patterns, 
      response_text, 
      response_type, 
      response_data,
      follow_up_questions 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Response ID is required' },
        { status: 400 }
      );
    }

    const updateData: {
      intent_id?: number;
      trigger_patterns?: string[];
      response_text?: string;
      response_type?: string;
      response_data?: Record<string, unknown> | null;
      follow_up_questions?: string[];
    } = {};
    if (intent_id !== undefined) updateData.intent_id = intent_id;
    if (trigger_patterns !== undefined) updateData.trigger_patterns = trigger_patterns;
    if (response_text !== undefined) updateData.response_text = response_text;
    if (response_type !== undefined) updateData.response_type = response_type;
    if (response_data !== undefined) updateData.response_data = response_data;
    if (follow_up_questions !== undefined) updateData.follow_up_questions = follow_up_questions;

    const { data: response, error } = await supabaseAdmin
      .from('responses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error updating response:', error);
    return NextResponse.json(
      { error: 'Failed to update response' },
      { status: 500 }
    );
  }
}

// DELETE - Remove response
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Response ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('responses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    return NextResponse.json(
      { error: 'Failed to delete response' },
      { status: 500 }
    );
  }
}
