export enum EPayrollTypes {
  biweekly = "Quincenal",
  monthly = "Mensual",
  yearly = "Anual",
  special = "Especial",
}

export enum EVacationRefundTypes {
  incapacity = "Incapacaidad",
  General = "General",
}

export enum ETypeDeductionType {
  ciclycal = "Ciclica",
  eventual = "Eventual",
  automatic = "Automatica",
}

export enum EPayrollState {
  authorized = "Autorizada",
  generated = "Generada",
  pending = "Pendiente",
}

export enum EManualDeductionState {
  current = "Vigente",
  finished = "Finalizada",
}

export enum ELicenceState {
  inProgress = "En curso",
  finished = "Finalizada",
}

export enum EOtherIncomesState {
  pending = "Pendiente",
  applied = "Aplicado",
}
