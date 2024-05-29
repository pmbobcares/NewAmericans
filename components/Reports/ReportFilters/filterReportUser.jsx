export const filterReportDataByUserId = (reportData, studentID) => {
  return reportData.filter(item => {
    if (item.StudentID == null || studentID == null) {
      return false;
  }
    return item.StudentID.toString() === studentID;
  });
};

