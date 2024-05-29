export const filterReportDataByYear = (reportData, year) => {
    return reportData.filter(item => {
      const itemYear = new Date(item.DateCreated).getFullYear();
      return itemYear.toString() === year;
    });
  };
  