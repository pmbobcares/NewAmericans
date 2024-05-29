const createCSV = (jsonDataToConvert) => {
    let csv = '';

    if (jsonDataToConvert.length > 0) {
        const headers = Object.keys(jsonDataToConvert[0]);
        csv += headers.join(',') + '\n';

        jsonDataToConvert.forEach(item => {
            const row = headers.map(header => item[header]);
            csv += row.join(',') + '\n';
        });
    }

    return csv;
};

export default createCSV;