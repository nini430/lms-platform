'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Chapter, Course } from '@prisma/client';
import { Loader2, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ChaptersList from './chapters-list';

interface ChapterFormProps {
  initialData: Course & {
    chapters: Chapter[];
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: '',
    },
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success('Chapter created!');
      setIsCreating((prev) => !prev);
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const onReorder=async(updatedData:{id:string,position:number}[])=>{
      try{
        setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`,{list:updatedData});
      toast.success('Reorder Success');
      router.refresh();
      }catch(err) {
        toast.error('Something went wrong');
      }finally{
        setIsUpdating(false);
      }
  }
  const onEdit=(id:string)=>{
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }
  return (
    <div className="relative border p-4 rounded-md bg-slate-100 mt-6">
      {isUpdating && (
        <div className='absolute w-full h-full flex items-center justify-center top-0 right-0 rounded-md bg-slate-500/20'>
            <Loader2 className='animate-spin w-6 h-6' />
          </div>
      )}
      <div className="flex justify-between items-center">
        Course Chapters
        <Button onClick={() => setIsCreating((prev) => !prev)} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Edit Chapters
            </>
          )}
        </Button>
      </div>
      {!isCreating && initialData.chapters.length === 0 && (
        <div className="text-sm text-slate-500 italic">No Chapters</div>
      )}

      {!isCreating && initialData.chapters.length > 0 && (
        <ChaptersList
          onReorder={onReorder}
          onEdit={onEdit}
          items={initialData?.chapters || []}
        />
      )}

      {isCreating && (
        <Form {...form}>
          <form
            noValidate
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-3">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};

export default ChapterForm;
