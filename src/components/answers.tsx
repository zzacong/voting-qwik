import {
  component$,
  Fragment,
  type PropFunction,
  type Signal,
} from '@builder.io/qwik';
import { type Answer, type Question } from '@prisma/client';

import { type VoteTally } from '~/types';

const Answers = component$(
  ({
    question,
    answers,
    voteTallies,
    loggedIn,
    onVote$,
  }: {
    question: Question;
    answers: Answer[];
    voteTallies: Signal<VoteTally[]>;
    loggedIn: boolean;
    onVote$?: PropFunction<(questionId: number, answerId: number) => void>;
  }) => {
    return (
      <div class="grid grid-cols-12 gap-4 px-5">
        {answers.map((answer) => {
          const votes =
            voteTallies.value.find(({ answerId }) => answerId === answer.id)
              ?.count ?? 0;

          const totalVotes = voteTallies.value
            .filter(({ questionId }) => questionId === question.id)
            ?.reduce((acc, { count }) => acc + (count ?? 0), 0);

          return (
            <Fragment key={answer.id}>
              <div class="col-span-4">{answer.answer}</div>
              <div class="col-span-3 flex justify-center">
                {loggedIn && (
                  <button
                    class="btn-primary btn-sm btn px-10"
                    onClick$={() => onVote$?.(question.id, answer.id)}
                  >
                    Vote
                  </button>
                )}
              </div>
              <div class="col-span-4">
                <progress
                  class="progress progress-error w-full"
                  value={Math.round((votes / totalVotes) * 100) || 0}
                  max="100"
                ></progress>
              </div>
              <div class="col-span-1">
                <span class="font-mono">{votes} votes</span>
              </div>
            </Fragment>
          );
        })}
      </div>
    );
  }
);

export default Answers;
