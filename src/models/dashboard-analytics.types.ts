export interface SalaryOverview {
  totalEmployees: number;
  averageSalary: number;
  minimumSalary: number;
  maximumSalary: number;
}

export interface CountryInsight {
  country: string;
  employeeCount: number;
  averageSalary: number;
  minimumSalary: number;
  maximumSalary: number;
}

export interface JobTitleInsight {
  jobTitle: string;
  employeeCount: number;
  averageSalary: number;
}

export interface SalaryDistributionBucket {
  range: string;
  count: number;
}

export interface TopPayingCountry {
  country: string;
  averageSalary: number;
}

export interface DashboardAnalytics {
  overview: SalaryOverview;
  countryInsights: CountryInsight[];
  jobTitleInsights: JobTitleInsight[];
  salaryDistribution: SalaryDistributionBucket[];
  topPayingCountries: TopPayingCountry[];
}
