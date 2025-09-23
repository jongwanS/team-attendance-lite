import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query as fsQuery, where } from 'firebase/firestore'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const scheduleId = req.nextUrl.searchParams.get('scheduleId')?.trim()
    const partnerId = req.nextUrl.searchParams.get('partnerId')?.trim()
    const userId = req.nextUrl.searchParams.get('userId')?.trim()
    const type = req.nextUrl.searchParams.get('type')?.trim()
    const startDate = req.nextUrl.searchParams.get('startDate')?.trim()
    const endDate = req.nextUrl.searchParams.get('endDate')?.trim()
    
    const colRef = collection(db, 'schedules')
    const filters: any[] = []

    if (scheduleId && scheduleId.length > 0) {
      filters.push(where('scheduleId', '==', scheduleId))
    }
    if (partnerId && partnerId.length > 0) {
      filters.push(where('partnerId', '==', partnerId))
    }
    if (userId && userId.length > 0) {
      filters.push(where('userId', '==', userId))
    }
    if (type && type.length > 0) {
      filters.push(where('type', '==', type))
    }
    if (startDate) {
      filters.push(where('startDateTime', '>=', startDate))
    }
    if (endDate) {
      filters.push(where('endDateTime', '<=', endDate))
    }

    let snap
    if (filters.length > 0) {
      const q = fsQuery(colRef, ...(filters as Parameters<typeof fsQuery>[1][]))
      snap = await getDocs(q)
    } else {
      snap = await getDocs(colRef)
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    return NextResponse.json({ items })
  } catch (error) {
    console.error('[GET /api/schedules] error:', error)
    return NextResponse.json({ error: 'Failed to fetch schedules', detail: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      scheduleId,
      partnerId,
      userId,
      title,
      description,
      startDateTime,
      endDateTime,
      type,
    } = body || {}

    if (!scheduleId || !partnerId || !userId || !title || !startDateTime || !endDateTime || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = {
      scheduleId,
      partnerId,
      userId,
      title,
      description: description || '',
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      type,
      createdAt: new Date(),
    }

    const ref = await addDoc(collection(db, 'schedules'), payload)
    return NextResponse.json({ id: ref.id }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/schedules] error:', error)
    return NextResponse.json({ error: 'Failed to add schedule', detail: String(error) }, { status: 500 })
  }
}