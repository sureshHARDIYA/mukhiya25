// app/api/portfolio/projects/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-auth';

export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    // Convert to the format expected by the frontend
    const formattedProjects = projects?.map(project => ({
      title: project.title,
      description: project.description || '',
      technologies: project.technologies || [],
      github: project.github_url || undefined,
      live: project.live_url || undefined,
      featured: project.featured,
      // GitHub-related fields (will be populated by GitHub service if URLs are provided)
      stars: 0,
      forks: 0,
      language: '',
    }));

    return NextResponse.json({ projects: formattedProjects || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
