'use client';

import { useState } from 'react';
import {toast} from 'react-hot-toast'
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Course } from '@prisma/client';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import FileUpload from '@/components/file-upload';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: 'Image is required' }),
});
const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
    const router=useRouter();
  const [isEditingMode, setIsEditingMode] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { imageUrl: initialData?.imageUrl as string },
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
        await axios.patch(`/api/courses/${courseId}`,values);
        toast.success('Course updated');
        setIsEditingMode(prev=>!prev);
        router.refresh();
    } catch (err) {
        toast.error('Something went wrong');
    }
  };
  return (
    <div className="border p-4 rounded-md bg-slate-100 mt-4">
      <div className="flex items-center justify-between">
        Course Image
        <Button
          onClick={() => setIsEditingMode((prev) => !prev)}
          variant="ghost"
        >
          {isEditingMode && <>Cancel</>}
          {!isEditingMode && initialData?.imageUrl && (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Image
            </>
          )}
          {!isEditingMode && !initialData?.imageUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Image
            </>
          )}
        </Button>
      </div>
      <div className='flex items-center justify-center'>
      {!isEditingMode &&
        (!initialData?.imageUrl ? (
          <div className="bg-slate-300 p-2 rounded-md h-60 flex justify-center items-center">
            <ImageIcon className="w-10 h-10 text-slate-700" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video w-40 h-40">
            <Image
              className="object-cover rounded-md"
              fill
              src={initialData.imageUrl}
              alt=""
            />
          </div>
        ))}

        {isEditingMode && (
            <div>
                <FileUpload endpoint='courseImage' onChange={(url?:string)=>(
                    onSubmit({imageUrl:url as string})
                )}/>
                <span className='text-sm text-muted-foreground'>120x120 aspect ratio is recommended</span>
                </div>
        )}
        
      </div>
      
    </div>
  );
};

export default ImageForm;
