import assert from 'node:assert/strict';
import test from 'node:test';
import { applicationContextReducer } from '../applicationContextReducer';
import { selectLastMessageType } from '../applicationContextSelectors';
import { initialApplicationContextState, toPersistedApplicationContext } from '../applicationContextState';

test('hydrates context with persisted state', () => {
  const state = applicationContextReducer(initialApplicationContextState, {
    type: 'HYDRATE',
    payload: {
      lastGarminMessage: {
        type: 'COURSE_DATA',
        courseName: 'My Course',
      },
    },
  });

  assert.equal(state.hydrated, true);
  assert.deepEqual(state.lastGarminMessage, {
    type: 'COURSE_DATA',
    courseName: 'My Course',
  });
  assert.equal(state.lastMessageType, 'COURSE_DATA');
});

test('tracks latest Garmin message as live runtime state', () => {
  const state = applicationContextReducer(initialApplicationContextState, {
    type: 'RECEIVE_GARMIN_MESSAGE',
    message: {
      type: 'SCORE_UPDATE',
      holeNumber: 1,
      strokes: 4,
    },
  });

  assert.deepEqual(state.lastGarminMessage, {
    type: 'SCORE_UPDATE',
    holeNumber: 1,
    strokes: 4,
  });
  assert.equal(state.lastMessageType, 'SCORE_UPDATE');
  assert.equal(selectLastMessageType(state), 'SCORE_UPDATE');
});

test('returns only persisted subset', () => {
  const persisted = toPersistedApplicationContext({
    hydrated: true,
    lastMessageType: 'COURSE_DATA',
    lastGarminMessage: {
      type: 'COURSE_DATA',
      courseName: 'West Course',
    },
  });

  assert.deepEqual(persisted, {
    lastGarminMessage: {
      type: 'COURSE_DATA',
      courseName: 'West Course',
    },
  });
});
