const axios = require('axios');

exports.postCherwellData = async (data) => {
  const url = process.env.CHERWELL_URL_POST_INCIDENT_REPORT;
  const apikey = process.env.CHERWELL_URL_POST_APIKEY_INCIDENT_REPORT;
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        apikey: apikey,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response code: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
};
