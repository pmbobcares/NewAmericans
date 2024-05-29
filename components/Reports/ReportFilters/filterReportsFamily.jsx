export const filterReportDataByFamilyID = (reportData, FamilyID) => {
  return reportData.filter(item => {
      if (item.FamilyID == null || FamilyID == null) {
          return false;
      }
      return item.FamilyID.toString() === FamilyID.toString();
  });
};