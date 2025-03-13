export interface IExamChartData {
  week: number;
  attempts: number;
}

export interface ISuccessRate {
  pass: number;
  average: number;
  fail: number;
};

export interface IAnalytics {
  users: {
    student: number;
    educator: number;
  };
  exams: {
    published: number;
    upcoming: number;
  };
  examChartdata: any[];
  successrate: ISuccessRate
  averages: {
    averageGrade: number;
    noOfAttemptsPerExam: number;
    averageCompletionTime: number;
  };
}


