import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import { Link, routeLoader$, useLocation } from '@builder.io/qwik-city';

import Header from '~/components/header';

import { prisma } from '~/server/db';
import styles from './styles.css?inline';

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export const useCategories = routeLoader$(async () => {
  const categories = await prisma.category.findMany();
  return categories;
});

const navItem = 'p-2';
const navItemActive = `${navItem} bg-gray-300 text-black rounded-md font-bold`;

export default component$(() => {
  useStyles$(styles);

  const categories = useCategories();
  const location = useLocation();

  return (
    <>
      <Header />

      <main class="px-4 py-6">
        <div class="gap-6 md:grid md:grid-cols-6">
          <div class="col-span-1 flex flex-col">
            <Link
              href="/"
              class={location.url.pathname === '/' ? navItemActive : navItem}
            >
              <div>Home</div>
            </Link>

            {categories.value?.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                class={
                  location.url.pathname === `/categories/${category.id}/`
                    ? navItemActive
                    : navItem
                }
              >
                <div>{category.name}</div>
              </Link>
            ))}
          </div>

          <div class="col-span-5">
            <Slot />
          </div>
        </div>
      </main>
    </>
  );
});
