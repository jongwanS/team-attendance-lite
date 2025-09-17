import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query as fsQuery, where } from 'firebase/firestore'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get('name')?.trim()
    const partnerId = req.nextUrl.searchParams.get('partnerId')?.trim()
    
    const colRef = collection(db, 'partners')
    const filters: any[] = []

    if (name && name.length > 0) {
      filters.push(where('name', '==', name))
    }
    if (partnerId && partnerId.length > 0) {
      filters.push(where('partnerId', '==', partnerId))
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
    console.error('[GET /api/partners] error:', error)
    return NextResponse.json({ error: 'Failed to fetch partners', detail: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      partnerId,
      name,
      contactPerson,
      phone,
      email,
    } = body || {}

    if (!partnerId || !name || !contactPerson || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = {
      partnerId,
      name,
      contactPerson,
      phone,
      email,
      createdAt: new Date(),
    }

    const docRef = await addDoc(collection(db, 'partners'), payload)
    return NextResponse.json({ id: docRef.id }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/partners] error:', error)
    return NextResponse.json({ error: 'Failed to add partner', detail: String(error) }, { status: 500 })
  }
}
