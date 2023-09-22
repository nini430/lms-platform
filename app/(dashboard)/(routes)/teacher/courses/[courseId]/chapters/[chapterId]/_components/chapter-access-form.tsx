'use client';

import { useState } from 'react';
import { Chapter } from '@prisma/client';
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
  FormDescription,
} from '@/components/ui/form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Editor from '@/components/editor';
import Preview from '@/components/preview';
import { Checkbox } from '@/components/ui/checkbox';

interface ChapterAccessFormProps {
  courseId: string;
  initialData: Chapter;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

const ChapterAccessForm = ({
  courseId,
  initialData,
  chapterId,
}: ChapterAccessFormProps) => {
  const router = useRouter();
  const [isEditingMode, setIsEditingMode] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFree: !!initialData.isFree },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
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
        Access Setting
        <Button
          onClick={() => setIsEditingMode((prev) => !prev)}
          variant="ghost"
        >
          {isEditingMode ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit Access
            </>
          )}
        </Button>
      </div>
      {!isEditingMode && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData?.isFree && 'text-slate-500 italic'
          )}
        >
          {!initialData?.isFree && 'This chapter is not free'}
          {initialData?.isFree && (
            'This chapter is free for preview'
          )}
        </p>
      )}
      {isEditingMode && (
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="isFree"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center gap-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormDescription>
                      Mark this if you want this chapter to be free
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2 mt-4">
              <Button disabled={isSubmitting || !isValid} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterAccessForm;
