import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { searchSessions, SessionFilters } from '@/lib/sessionQueries'

export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)

    // Parse filters from query params
    const filters: SessionFilters = {
      search: searchParams.get('search') || undefined,
      categories: searchParams.get('categories')?.split(',').filter(Boolean) || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      freeOnly: searchParams.get('freeOnly') === 'true',
      dateFrom: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined,
      dateTo: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined,
      difficulty: searchParams.get('difficulty')?.split(',').filter(Boolean) || undefined,
      availableOnly: searchParams.get('availableOnly') === 'true',
      duration: searchParams.get('duration')
        ?.split(',')
        .map(Number)
        .filter(Boolean) || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'date',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    }

    const result = await searchSessions(filters)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Error searching sessions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search sessions' },
      { status: 500 }
    )
  }
}
