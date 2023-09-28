

export function calculateDifferenceDays(
    dateInit: any,
    dateEnd?: any
  ): number {
    const currentDate = dateEnd ? new Date(dateEnd) : new Date();
    const differenceInMilliseconds =
      currentDate.getTime() - new Date(dateInit).getTime();
    const differenceInDays = differenceInMilliseconds / (24 * 60 * 60 * 1000) + 1;
    return Math.floor(differenceInDays);
  }