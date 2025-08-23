// app/api/portfolio/experience/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-auth';

export async function GET() {
  try {
    const { data: experience, error } = await supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching experience:', error);
      return NextResponse.json(
        { error: 'Failed to fetch experience' },
        { status: 500 }
      );
    }

    // Convert to the format expected by the frontend
    const formattedExperience = experience?.map(exp => {
      const startDate = exp.start_date ? new Date(exp.start_date) : null;
      const endDate = exp.end_date ? new Date(exp.end_date) : null;
      
      let duration = '';
      if (startDate) {
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (exp.is_current) {
          duration = `${startMonth} - Present`;
        } else if (endDate) {
          const endMonth = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          duration = `${startMonth} - ${endMonth}`;
        } else {
          duration = startMonth;
        }
      }

      return {
        title: exp.title,
        company: exp.company,
        duration,
        description: exp.description || [],
        technologies: exp.technologies || [],
      };
    });

    return NextResponse.json({ experience: formattedExperience || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
