'use client';

import { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Chapter, Course } from '@prisma/client';

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ChapterTitleFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId:string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
});

const ChapterTitleForm = ({ initialData, courseId, chapterId }: ChapterTitleFormProps) => {
  const router = useRouter();
  const [isEditing, setisEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success('Chapter updated');
      setisEditing((prev) => !prev);
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 p-4 rounded-md">
      <div className="flex items-center justify-between">
        Chapter title
        <Button
          onClick={() => setisEditing((current) => !current)}
          variant="ghost"
        >
          {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" /> Edit Title</>}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-4">{initialData?.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g Introduction to the course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting}>Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterTitleForm;
