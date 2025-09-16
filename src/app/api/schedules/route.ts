import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query as fsQuery, where } from 'firebase/firestore'

export const runtime = 'nodejs'

// GET /api/schedules  → 전체 조회
export async function GET(req: NextRequest) {
  try {
    const userName = req.nextUrl.searchParams.get('userName')?.trim()
    const startStr = req.nextUrl.searchParams.get('start')?.trim()
    const endStr = req.nextUrl.searchParams.get('end')?.trim()

    const colRef = collection(db, 'schedules')
    const filters: any[] = []

    if (userName && userName.length > 0) {
      filters.push(where('userName', '==', userName))
    }
    if (startStr) {
      const startDate = new Date(startStr)
      if (!isNaN(startDate.getTime())) {
        filters.push(where('startDate', '>=', startDate))
      }
    }
    if (endStr) {
      const endDate = new Date(endStr)
      if (!isNaN(endDate.getTime())) {
        filters.push(where('startDate', '<=', endDate))
      }
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
    return NextResponse.json({ error: 'Failed to fetch schedules', detail: String(error) }, { status: 500 })
  }
}

// POST /api/schedules  → page.tsx 예시 형태로 저장
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId,
      userName,
      type, // 'annual' | 'half_morning' | 'half_afternoon' | 'sick' | ...
      startDate,
      endDate,
      reason,
      status, // 'pending' | 'approved' | 'rejected'
    } = body || {}

    if (!userId || !userName || !type || !startDate || !endDate || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const now = new Date()
    const payload = {
      userId,
      userName,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason: reason ?? '',
      status,
      createdAt: now,
      updatedAt: now,
    }

    const ref = await addDoc(collection(db, 'schedules'), payload)
    return NextResponse.json({ id: ref.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add schedule', detail: String(error) }, { status: 500 })
  }
}


