import { component$ } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';

import {
  useAuthSession,
  useAuthSignin,
  useAuthSignout,
} from '~/routes/plugin@auth';

export default component$(() => {
  const session = useAuthSession();
  const signIn = useAuthSignin();
  const signOut = useAuthSignout();

  return (
    <header class="flex border-b border-b-slate-500 px-5 py-5">
      <div class="flex-grow">
        {session.value?.user && (
          <span class="font-mono">{session.value.user.name}</span>
        )}
      </div>
      {session.value?.user?.email ? (
        <Form action={signOut}>
          <button>Sign Out</button>
        </Form>
      ) : (
        <Form action={signIn}>
          <button>Sign In</button>
        </Form>
      )}
    </header>
  );
});
