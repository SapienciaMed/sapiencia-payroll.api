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

export function formaterNumberToCurrency(number: number | string): string {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  });

  return formatter.format(Number(number));
}

export function formaterNumberSeparatorMiles(numberFormated: number): string {
  const numeroFormateado = numberFormated.toLocaleString();

  return numeroFormateado;
}

export function getNextBusinessDay(
  dateString: any,
  holidays: string[] = []
): Date {
  const currentDay = new Date(dateString);
  let dayOfWeek = currentDay.getDay();

  const isHoliday = (date: Date): boolean => {
    const formattedDate = date.toISOString().split("T")[0];
    return holidays.includes(formattedDate);
  };

  let daysToAdd = 1;
  if (dayOfWeek === 5) {
    daysToAdd = 3;
  } else if (dayOfWeek === 6) {
    daysToAdd = 2;
  }

  while (daysToAdd > 0 || isHoliday(currentDay)) {
    currentDay.setDate(currentDay.getDate() + 1);
    dayOfWeek = currentDay.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(currentDay)) {
      daysToAdd--;
    }
  }

  return currentDay;
}
