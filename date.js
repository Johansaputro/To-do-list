exports.getDate = function() {
  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  // var currentDay = today.getDay();
  // var day = "";
  
  return today.toLocaleDateString("en-US", options);
}
