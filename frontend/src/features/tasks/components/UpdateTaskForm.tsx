import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTask } from "@/features/tasks/api/mutations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTaskFormSchema,
  type CreateTaskFormSchema,
  type Task,
} from "@/features/tasks/types";
import { taskQueries } from "@/features/tasks/api/queries";
import { SignalLowIcon, SignalMediumIcon, SignalHighIcon } from "lucide-react";

export function UpdateTaskForm({
  task,
  setOpen,
}: {
  task: Task;
  setOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const updateTaskMutation = useUpdateTask(task.id);

  const form = useForm({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
    },
  });

  const onSubmit: SubmitHandler<CreateTaskFormSchema> = (data) => {
    updateTaskMutation.mutate(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: taskQueries.lists() });
        setOpen(false);
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-title">Title</FieldLabel>
              <Input
                {...field}
                id="form-title"
                aria-invalid={fieldState.invalid}
                placeholder="My new task."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-description">Description</FieldLabel>
              <Textarea
                {...field}
                id="form-description"
                aria-invalid={fieldState.invalid}
                placeholder="Describe your task."
                className="max-h-16"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="priority"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-priority">Priority</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-priority"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Priority</SelectLabel>
                    <SelectItem value="low">
                      Low <SignalLowIcon />
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium <SignalMediumIcon />
                    </SelectItem>
                    <SelectItem value="high">
                      High <SignalHighIcon />
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={updateTaskMutation.isPending}
          >
            Update Task
            {updateTaskMutation.isPending && <Spinner />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
