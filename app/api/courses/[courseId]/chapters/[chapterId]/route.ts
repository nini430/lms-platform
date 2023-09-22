import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PATCH(req:Request,{params}:{params:{courseId:string,chapterId:string}}) {
    try{
    const {userId}=auth();

    const {isPublished,...values}=await req.json();

    if(!userId) {
        return new NextResponse('unauthorized',{status:401});
    }

    const courseOwner=await db.course.findUnique({
        where:{
            id:params.courseId,
            userId
        }
    })

    if(!courseOwner) {
        return new NextResponse('action not allowed',{status:403});
    }
    //TODO: handle video upload

    const chapter=await db.chapter.update({
        where:{
            id:params.chapterId,
            courseId:params.courseId
        },
        data:{
            ...values
        }
    });
    return NextResponse.json(chapter);
    }catch(err) {
        console.log('chapter patch',err);
        return new NextResponse('Internal error',{status:500});
    }
}