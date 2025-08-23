// app/api/portfolio/education/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-auth';

export async function GET() {
  try {
    const { data: education, error } = await supabase
      .from('education')
      .select('*')
      .order('end_year', { ascending: false });

    if (error) {
      console.error('Error fetching education:', error);
      return NextResponse.json(
        { error: 'Failed to fetch education' },
        { status: 500 }
      );
    }

    // Convert to the format expected by the frontend
    const formattedEducation = education?.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.end_year ? edu.end_year.toString() : 'Present',
      description: edu.description || '',
      status: edu.status as 'completed' | 'current',
    }));

    return NextResponse.json({ education: formattedEducation || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
