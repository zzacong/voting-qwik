import { component$ } from '@builder.io/qwik';
import { routeAction$, zod$, z, Form } from '@builder.io/qwik-city';

import { prisma } from '~/server/db';

export const useCreateCategory = routeAction$(
  async (data) => {
    const category = await prisma.category.create({ data });
    return category;
  },
  zod$({
    name: z.string(),
  })
);

export default component$(() => {
  const createCategory = useCreateCategory();

  return (
    <div class="space-y-8">
      <h1 class="mb-4 text-2xl font-bold">Create Category</h1>
      <Form
        action={createCategory}
        class="grid-col-[2fr_3fr] grid max-w-lg items-center gap-4"
      >
        <label for="name">Name</label>
        <input
          id="name"
          name="name"
          value={createCategory.formData?.get('name')}
          class="input-bordered input"
        />
        <button
          type="submit"
          class="btn col-span-2 disabled:btn-disabled"
          disabled={createCategory.isRunning}
        >
          Create
        </button>
      </Form>

      {createCategory.value && (
        <div>
          <h2 class="text-xl">Category created successfully!</h2>
        </div>
      )}
    </div>
  );
});
