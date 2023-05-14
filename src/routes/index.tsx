import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, Link } from '@builder.io/qwik-city';

import { prisma } from '~/server/db';

export const useCategories = routeLoader$(async () => {
  const categories = await prisma.category.findMany();
  return categories;
});

export default component$(() => {
  const categories = useCategories();

  return (
    <ul class="xs:grid-cols-1 grid md:grid-cols-2 lg:grid-cols-3">
      {categories.value?.map((category) => (
        <li key={category.id} class="p-2">
          <Link href={`/categories/${category.id}`}>
            <div class="card glass w-full">
              <figure>
                <img
                  width={500}
                  height={200}
                  src={`/${category.image}`}
                  alt={category.name}
                  class="object-contain"
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">{category.name}</h2>
                <div class="card-actions justify-end">
                  <button class="btn-primary btn">Vote now!</button>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
