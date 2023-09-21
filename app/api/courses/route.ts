import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('unauthorized', { status: 401 });
    }

    if (!title) {
      return new NextResponse('title is required', { status: 400 });
    }

    const course = await db.course.create({
      data: { title, userId },
    });
    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    console.log('[COURSES]', err);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
