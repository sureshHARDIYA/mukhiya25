// app/api/portfolio/skills/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-auth';

export async function GET() {
  try {
    const { data: skills, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_active', true)
      .order('category_name', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching skills:', error);
      return NextResponse.json(
        { error: 'Failed to fetch skills' },
        { status: 500 }
      );
    }

    // Group skills by category
    const groupedSkills = skills?.reduce((acc, skill) => {
      const category = skill.category_name;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        name: skill.skill_name,
        level: skill.skill_level,
        color: skill.color,
      });
      return acc;
    }, {} as Record<string, Array<{ name: string; level: number; color: string }>>);

    // Convert to the format expected by the frontend
    const skillCategories = Object.entries(groupedSkills || {}).map(([name, skills]) => ({
      name,
      skills,
    }));

    return NextResponse.json({ skills: skillCategories });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
