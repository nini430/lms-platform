import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!url) {
      return new NextResponse('url is required', { status: 400 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse('Action not allowed', { status: 403 });
    }

    const attachment = await db.attachment.create({
      data: {
        courseId: params.courseId,
        url,
        name: url.split('/').pop(),
      },
    });

    return NextResponse.json(attachment, { status: 201 });
  } catch (err) {
    console.log('Course attachments', err);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
