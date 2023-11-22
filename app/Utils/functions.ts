export function calculateDifferenceDays(dateInit: any, dateEnd?: any): number {
  const currentDate = dateEnd ? new Date(dateEnd) : new Date();
  const differenceInMilliseconds =
    currentDate.getTime() - new Date(dateInit).getTime();
  const differenceInDays = differenceInMilliseconds / (24 * 60 * 60 * 1000) + 1;
  return Math.floor(differenceInDays);
}

export function addCalendarDays(
  date: any,
  daysToAdd: number,
  substractionOneDay: boolean = true
): Date {
  if (substractionOneDay) {
    const oneDay = 24 * 60 * 60 * 1000;
    const inputDate = new Date(date);
    const newDate = new Date(inputDate.getTime() + (daysToAdd - 1) * oneDay);

    return newDate;
  } else {
    const oneDay = 24 * 60 * 60 * 1000;
    const inputDate = new Date(date);
    const newDate = new Date(inputDate.getTime() + daysToAdd * oneDay);

    return newDate;
  }
}

export function formaterNumberToCurrency(number) {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  });

  return formatter.format(number);
}
