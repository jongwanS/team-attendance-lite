import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query as fsQuery, where } from 'firebase/firestore'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')?.trim()
    const workDate = req.nextUrl.searchParams.get('workDate')?.trim()
    const status = req.nextUrl.searchParams.get('status')?.trim()
    
    const colRef = collection(db, 'attendance')
    const filters: any[] = []

    if (userId && userId.length > 0) {
      filters.push(where('userId', '==', userId))
    }
    if (workDate && workDate.length > 0) {
      filters.push(where('workDate', '==', workDate))
    }
    if (status && status.length > 0) {
      filters.push(where('status', '==', status))
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
    console.error('[GET /api/attendance] error:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance', detail: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId,
      workDate,
      checkIn,
      checkOut,
      workHours,
      status,
      remark,
    } = body || {}

    if (!userId || !workDate || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = {
      userId,
      workDate,
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      workHours: workHours || 0,
      status,
      remark: remark || '',
      createdAt: new Date(),
    }

    const docRef = await addDoc(collection(db, 'attendance'), payload)
    return NextResponse.json({ id: docRef.id }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/attendance] error:', error)
    return NextResponse.json({ error: 'Failed to add attendance', detail: String(error) }, { status: 500 })
  }
}
