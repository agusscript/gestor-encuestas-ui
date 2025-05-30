export interface QuestionStatistics {
  question: string;
  type: string;
  totalResponses: number;
  options?: OptionStatistic[];
  textResponses?: string[];
  responseRate?: number;
}

export interface OptionStatistic {
  option: string;
  count: number;
  percentage: number;
}

export interface ChartData {
  labels: string[];
  datasets: any[];
}
