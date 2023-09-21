'use client';

import { useState } from 'react';
import { Course } from '@prisma/client';
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
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface DescriptionFormProps {
  courseId: string;
  initialData: Course;
}

const formSchema = z.object({
  description: z.string().min(1, { message: 'description is required' }),
});

const DescriptionForm = ({ courseId, initialData }: DescriptionFormProps) => {
  const router = useRouter();
  const [isEditingMode, setIsEditingMode] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData?.description as string },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course updated');
      setIsEditingMode((prev) => !prev);
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="p-4 border rounded-md bg-slate-100 mt-4">
      <div className="flex items-center justify-between">
        Course Description
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
        <p
          className={cn(
            'text-sm mt-2',
            !initialData?.description && 'text-slate-500 italic'
          )}
        >
          {initialData?.description || 'No Description'}
        </p>
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
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="This course is about"
                      {...field}
                    />
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

export default DescriptionForm;
