'use client';

import { useState } from 'react';
import { Chapter} from '@prisma/client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Editor from '@/components/editor';
import Preview from '@/components/preview';

interface ChapterDescriptionFormProps {
  courseId: string;
  initialData: Chapter;
  chapterId:string;
}

const formSchema = z.object({
  description: z.string().min(1)
});

const ChapterDescriptionForm = ({ courseId, initialData, chapterId  }: ChapterDescriptionFormProps) => {
  const router = useRouter();
  const [isEditingMode, setIsEditingMode] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData?.description as string },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success('Chapter updated');
      setIsEditingMode((prev) => !prev);
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="p-4 border rounded-md bg-slate-100 mt-4">
      <div className="flex items-center justify-between">
        Chapter Description
        <Button
          onClick={() => setIsEditingMode((prev) => !prev)}
          variant="ghost"
        >
          {isEditingMode ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit Description
            </>
          )}
        </Button>
      </div>
      {!isEditingMode && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData?.description && 'text-slate-500 italic'
          )}
        >
          {!initialData?.description && 'No Description'}
          {initialData?.description && (
            <Preview value={initialData?.description} />
          )}
        </div>
      )}
      {isEditingMode && (
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2 mt-4'>
                <Button disabled={isSubmitting || !isValid} type='submit'>
                    Save
                </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterDescriptionForm;
