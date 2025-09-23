import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query as fsQuery, where } from 'firebase/firestore'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')?.trim()
    const leaveId = req.nextUrl.searchParams.get('leaveId')?.trim()
    const status = req.nextUrl.searchParams.get('status')?.trim()
    const startDate = req.nextUrl.searchParams.get('startDate')?.trim()
    const endDate = req.nextUrl.searchParams.get('endDate')?.trim()
    
    const colRef = collection(db, 'leaves')
    const filters: any[] = []

    if (userId && userId.length > 0) {
      filters.push(where('userId', '==', userId))
    }
    if (leaveId && leaveId.length > 0) {
      filters.push(where('leaveId', '==', leaveId))
    }
    if (status && status.length > 0) {
      filters.push(where('status', '==', status))
    }
    if (startDate) {
      filters.push(where('startDate', '>=', startDate))
    }
    if (endDate) {
      filters.push(where('endDate', '<=', endDate))
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
    console.error('[GET /api/leaves] error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaves', detail: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      leaveId,
      userId,
      leaveType,
      reason,
      startDate,
      endDate,
      status,
      approvedBy,
    } = body || {}

    if (!leaveId || !userId || !leaveType || !startDate || !endDate || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = {
      leaveId,
      userId,
      leaveType,
      reason: reason || '',
      startDate,
      endDate,
      status,
      appliedAt: new Date(),
      approvedBy: approvedBy || null,
    }

    const docRef = await addDoc(collection(db, 'leaves'), payload)
    return NextResponse.json({ id: docRef.id }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/leaves] error:', error)
    return NextResponse.json({ error: 'Failed to add leave', detail: String(error) }, { status: 500 })
  }
}
