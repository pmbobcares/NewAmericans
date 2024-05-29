export const filterReportDataByAdminID = (reportData, adminID) => {
  return reportData.filter(item => {
    if (item.AdminID == null || adminID == null) {
      return false;
  }
    return item.AdminID.toString() === adminID;
  });
};
