import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applicationContextReducer,
  initialApplicationContextState,
  toPersistedApplicationContext,
} from './applicationContextState';

test('hydrates context with persisted state', () => {
  const state = applicationContextReducer(initialApplicationContextState, {
    type: 'HYDRATE',
    payload: {
      courseName: 'My Course',
      scores: { '1': 4 },
    },
  });

  assert.equal(state.hydrated, true);
  assert.equal(state.courseName, 'My Course');
  assert.deepEqual(state.scores, { '1': 4 });
});

test('handles course and score updates from Garmin messages', () => {
  const courseState = applicationContextReducer(initialApplicationContextState, {
    type: 'RECEIVE_GARMIN_MESSAGE',
    message: {
      type: 'COURSE_DATA',
      courseName: 'North Course',
    },
  });

  assert.equal(courseState.courseName, 'North Course');
  assert.equal(courseState.lastMessageType, 'COURSE_DATA');

  const scoreState = applicationContextReducer(courseState, {
    type: 'RECEIVE_GARMIN_MESSAGE',
    message: {
      type: 'SCORE_UPDATE',
      holeNumber: 1,
      strokes: 5,
    },
  });

  assert.deepEqual(scoreState.scores, { '1': 5 });
  assert.equal(scoreState.lastMessageType, 'SCORE_UPDATE');
});

test('returns only persisted subset', () => {
  const persisted = toPersistedApplicationContext({
    hydrated: true,
    lastMessageType: 'SCORE_UPDATE',
    courseName: 'West Course',
    scores: { '9': 3 },
  });

  assert.deepEqual(persisted, {
    courseName: 'West Course',
    scores: { '9': 3 },
  });
});
