import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

import { useAuthSession } from '~/routes/plugin@auth';

export default component$(() => {
  const session = useAuthSession();

  return (
    <>
      <p>Email: {session.value?.user?.email}</p>
    </>
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
