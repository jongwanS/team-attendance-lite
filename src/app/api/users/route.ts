import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query as fsQuery, where } from 'firebase/firestore'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    // Support both ?name= and ?userName=
    const nameParam = req.nextUrl.searchParams.get('name')?.trim()
    const userNameParam = req.nextUrl.searchParams.get('userName')?.trim()
    const targetName = (userNameParam || nameParam) || undefined
    let snap
    if (targetName && targetName.length > 0) {
      const q = fsQuery(collection(db, 'users'), where('userName', '==', targetName))
      snap = await getDocs(q)
    } else {
      snap = await getDocs(collection(db, 'users'))
    }
    const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    return NextResponse.json({ users })
  } catch (error) {
    console.error('[GET /api/users] error:', error)
    return NextResponse.json({ error: 'Failed to fetch users', detail: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId,
      partnerId,
      name,
      email,
      phone,
      role,
      hireDate,
      status,
    } = body || {}

    if (!userId || !name || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = {
      userId,
      partnerId: partnerId || null,
      name,
      email,
      phone: phone || '',
      role,
      hireDate: hireDate || null,
      status: status || 'ACTIVE',
      createdAt: new Date(),
    }

    const docRef = await addDoc(collection(db, 'users'), payload)
    return NextResponse.json({ id: docRef.id }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/users] error:', error)
    return NextResponse.json({ error: 'Failed to add user', detail: String(error) }, { status: 500 })
  }
}


