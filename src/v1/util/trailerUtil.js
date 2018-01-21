// Sort the video based on criteria like official vido, resolution .etc.
// Here we are sorting to return Official videos first in the list.
function sortVideo(a, b) {
  let comparison = 0;
  if (a.name.includes('Official')) {
    comparison = -1;
  }
  if (b.name.includes('Official')) {
    comparison = 1;
  }
  return comparison;
}

// Here we filter/order the trailer response to give optimal result.
// Sort to return official video first
module.exports.filterData = function filterData(trailerResponse, req) {
  // Device type can be a criteria to select the optimal result. It is not used currently.
  const deviceType = req.device.type;
  const sortedArr = trailerResponse.sort(sortVideo);
  return sortedArr;
};

//  Find the URL based on the source site & Transform the response
module.exports.formatTrailerResponse = function formatTrailerResponse(trailerResponse) {
  trailerResponse.map((val) => {
    if (val.site === 'YouTube') {
      val.url = `https://www.youtube.com/watch?v=${val.key}`;
    }
    return val;
  });

  return { url: trailerResponse[0].url };
};
