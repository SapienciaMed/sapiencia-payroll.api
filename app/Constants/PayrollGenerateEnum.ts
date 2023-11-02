export enum EDeductionTypes {
  incomeTax = 12,
  solidarityFund = 13,
  SocialSecurity = 10,
  retirementFund = 11,
  dependentPeople = 14,
}

export enum EGroupers {
  incomeTaxGrouper = 1,
  incomeCyclicDeduction = 5,
  totalDeductions = 6,
  incomeBountyService = 7,
}

export enum EPayrollTypes {
  biweekly = 1,
  monthly = 2,
  vacation = 8,
  serviceBounty = 10,
  primaService = 5,
  primaChristmas = 4,
}

export enum EIncomeTypes {
  license = 4,
  incapacity = 3,
  vacation = 2,
  salary = 1,
  primaChristmas = 11,
  serviceBonus = 12,
  primaService = 13,
  primaVacations = 14,
  bonusRecreation = 15,
  severancePayInterest = 16,
}

export enum EIncapacityTypes {
  general = 1,
  occupational = 2,
}

export enum EReserveTypes {
  bountyService = 1,
  bonusService = 2,
  bountyRecreation = 3,
  vacation = 4,
  bonusVacation = 5,
  bonusChristmas = 6,
  severancePay = 7,
  severancePayInterest = 8,
}
