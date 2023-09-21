'use client';

import { Course } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import formatPrice from '@/lib/format';

interface PriceFormProps {
  courseId: string;
  initialData: Course;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

const PriceForm = ({ courseId, initialData }: PriceFormProps) => {
    const router=useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { price: initialData?.price as number } || undefined,
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`,values);
      toast.success('Course updated');
      setIsEditing(prev=>!prev);
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="border p-4 bg-slate-100 rounded-md mt-4">
      <div className="flex justify-between items-center">
        Course Price
        <Button onClick={() => setIsEditing((prev) => !prev)} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm',
            !initialData?.price && 'italic text-slate-600'
          )}
        >
          {initialData?.price ? formatPrice(initialData.price):'No Price'}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            noValidate
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="e.g 15.00$" step={0.01} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2 mt-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PriceForm;
