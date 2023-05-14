import type { Question } from '@prisma/client';
import type { VoteTally } from '~/types';

import { $, component$, useComputed$, useSignal } from '@builder.io/qwik';
import { routeLoader$, server$ } from '@builder.io/qwik-city';

import { prisma } from '~/server/db';
import { createThankYouNote } from '~/server/openai';
import { useAuthSession } from '~/routes/plugin@auth';

import Answers from '~/components/answers';

const vote = server$(
  async (email: string, questionId: number, answerId: number) => {
    await prisma.vote.deleteMany({
      where: { email, questionId },
    });

    await prisma.vote.create({
      data: {
        email,
        questionId,
        answerId,
      },
    });

    const question = await prisma.question.findFirst({
      where: { id: questionId },
    });
    const questions = await prisma.question.findMany({
      where: { categoryId: question?.categoryId ?? 0 },
      include: {
        answers: true,
      },
    });

    const answer = await prisma.answer.findFirst({
      where: { id: answerId },
    });

    const votes = await getVotes(questions);

    return {
      votes,
      thankYou: await createThankYouNote(
        question?.question ?? '',
        answer?.answer ?? ''
      ),
    };
  }
);

const getVotes = async (questions: Question[]): Promise<VoteTally[]> =>
  (
    await prisma.vote.groupBy({
      where: { questionId: { in: questions.map((q) => q.id) } },
      by: ['questionId', 'answerId'],
      _count: {
        answerId: true,
      },
    })
  ).map(({ questionId, answerId, _count }) => ({
    questionId,
    answerId,
    count: _count?.answerId ?? 0,
  }));

export const useQuestions = routeLoader$(async ({ params, status }) => {
  const categoryId = +params.categoryId;
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    // Set the status to 404 if the user is not found
    status(404);
  }

  const questions = await prisma.question.findMany({
    where: { categoryId: categoryId },
    include: {
      answers: true,
    },
  });

  const votes = await getVotes(questions);

  return { questions, votes };
});

export default component$(() => {
  const session = useAuthSession();
  const questions = useQuestions();

  const response = useSignal<string | undefined>();
  const updatedVotes = useSignal<VoteTally[]>();

  const onVote = $(async (questionId: number, answerId: number) => {
    const voteResponse = await vote(
      session.value?.user?.email ?? '',
      questionId,
      answerId
    );
    response.value = voteResponse.thankYou;
    updatedVotes.value = voteResponse.votes;
    setTimeout(() => (response.value = undefined), 3000);
  });

  const voteTallies = useComputed$(
    () => updatedVotes.value ?? questions.value?.votes ?? []
  );

  return (
    <>
      {response.value && (
        <div class="toast-end toast toast-top">
          <div class="alert alert-success">
            <div>
              <span>{response.value}</span>
            </div>
          </div>
        </div>
      )}

      <ul>
        {questions.value.questions.map((question) => (
          <li key={question.id} class="mb-6 mt-3">
            <div class="mb-3 text-2xl font-bold">{question.question}</div>
            <Answers
              question={question}
              answers={question.answers}
              voteTallies={voteTallies}
              loggedIn={!!session.value?.user}
              onVote$={onVote}
            />
          </li>
        ))}
      </ul>
    </>
  );
});
