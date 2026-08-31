export interface CourseDataPayload {
  type: 'COURSE_DATA';
  courseName: string;
}

export interface ScoreUpdatePayload {
  type: 'SCORE_UPDATE';
  holeNumber: number;
  strokes: number;
}

export type GarminMessage = CourseDataPayload | ScoreUpdatePayload;
