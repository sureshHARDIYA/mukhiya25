// app/api/portfolio/research/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-auth';

export async function GET() {
  try {
    const { data: research, error } = await supabase
      .from('research_papers')
      .select('*')
      .order('publication_date', { ascending: false });

    if (error) {
      console.error('Error fetching research:', error);
      return NextResponse.json(
        { error: 'Failed to fetch research' },
        { status: 500 }
      );
    }

    // Convert to the format expected by the frontend
    const formattedResearch = research?.map(paper => ({
      title: paper.title,
      authors: paper.authors || [],
      journal: paper.publication || '',
      year: paper.publication_date ? new Date(paper.publication_date).getFullYear().toString() : '',
      abstract: paper.abstract || '',
      doi: paper.doi || undefined,
      url: paper.url || undefined,
    }));

    return NextResponse.json({ research: formattedResearch || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
