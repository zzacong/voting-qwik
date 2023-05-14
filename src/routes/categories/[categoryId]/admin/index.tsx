import { component$ } from '@builder.io/qwik';
import { routeAction$, zod$, z, Form } from '@builder.io/qwik-city';

import { prisma } from '~/server/db';

export const useCreateQuestion = routeAction$(
  async (data, { params }) => {
    const question = await prisma.question.create({
      data: {
        categoryId: +params.categoryId,
        question: data.question,
      },
    });
    for (const answer of [
      data.answer1,
      data.answer2,
      data.answer3,
      data.answer4,
      data.answer5,
    ].filter(Boolean)) {
      await prisma.answer.create({
        data: {
          questionId: question.id,
          answer: answer!,
        },
      });
    }
    return question;
  },
  zod$({
    question: z.string(),
    answer1: z.string().optional(),
    answer2: z.string().optional(),
    answer3: z.string().optional(),
    answer4: z.string().optional(),
    answer5: z.string().optional(),
  })
);

export default component$(() => {
  const createQuestion = useCreateQuestion();
  return (
    <div class="space-y-6">
      <h1 class="mb-6 text-3xl font-bold">Create question</h1>

      <Form action={createQuestion} class="">
        <div class="grid w-full max-w-lg grid-cols-[2fr_3fr] items-center gap-4">
          <label>Question</label>
          <input
            name="question"
            value={createQuestion.formData?.get('question')}
            class="input-bordered input"
          />

          <label>Answer 1</label>
          <input
            name="answer1"
            value={createQuestion.formData?.get('answer1')}
            class="input-bordered input"
          />

          <label>Answer 2</label>
          <input
            name="answer2"
            value={createQuestion.formData?.get('answer2')}
            class="input-bordered input"
          />

          <label>Answer 3</label>
          <input
            name="answer3"
            value={createQuestion.formData?.get('answer3')}
            class="input-bordered input"
          />

          <label>Answer 4</label>
          <input
            name="answer4"
            value={createQuestion.formData?.get('answer4')}
            class="input-bordered input"
          />

          <label>Answer 5</label>
          <input
            name="answer5"
            value={createQuestion.formData?.get('answer5')}
            class="input-bordered input"
          />

          <button type="submit" class="btn col-span-2 disabled:btn-disabled">
            Create
          </button>
        </div>
      </Form>

      {createQuestion.value && (
        <div>
          <h2 class="text-xl">Question created successfully!</h2>
        </div>
      )}
    </div>
  );
});
