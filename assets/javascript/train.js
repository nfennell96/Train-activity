// Initialize Firebase
var config = {
  apiKey: "AIzaSyCuOSrsFE_srwYwH4PLturATc6788e5OAU",
  authDomain: "train-schedule-271a6.firebaseapp.com",
  databaseURL: "https://train-schedule-271a6.firebaseio.com",
  projectId: "train-schedule-271a6",
  storageBucket: "train-schedule-271a6.appspot.com",
  messagingSenderId: "282138469699"
};
firebase.initializeApp(config);

var database = firebase.database();

// create varaibles
var currentTime = moment();
var ConvertedCurrentTime = moment().format('LT');
var nextTrain;
var mintuesUntilTrain;
var submitTrainName;
var submitDestination;
var submitFirstTime;
var submitFrequency;

// Get the times based off of Current Time and Submitted Time
function getTimes() {
  var convertCurrentTime = moment(ConvertedCurrentTime, 'HH:mm').format('hh:mm a');
  var convertSubmittedTime = moment(submitFirstTime, 'HH:mm').format('hh:mm a');

  // Run this, if the submitted time is set in the past
  if (convertCurrentTime > convertSubmittedTime) {
    var convertTime = moment(submitFirstTime, "hh:mm").subtract("1, years");
    var difference = currentTime.diff(moment(convertTime), "minutes");
    var remainder = difference % submitFrequency;
    var minUntilTrain = submitFrequency - remainder;
    nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");
    mintuesUntilTrain = parseInt(minUntilTrain);

// Run this if the Submitted time is in the future
  } else {
    var convertTime = moment(submitFirstTime, "hh:mm").subtract("1, years");
    var difference = convertTime.diff(moment(), "minutes");
    mintuesUntilTrain = parseInt(difference);
    nextTrain = moment(submitFirstTime, 'HH:mm').format('hh:mm a');
    console.log("Else"+mintuesUntilTrain);
    console.log("Else"+nextTrain);
  }
}


// On Sumbit button, this will build in Firebase and update local variables
$("#trainBtn").on("click", function (event) {
  event.preventDefault();

  submitTrainName = $("#trainName").val().trim();
  submitDestination = $("#destination").val().trim();
  submitFirstTime = $("#firstTime").val().trim();
  submitFrequency = $("#frequency").val().trim();

  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTime").val("");
  $("#frequency").val("");

  console.log(`Train Name: ${submitTrainName}`);
  console.log(`Train Destination: ${submitDestination}`);
  console.log(`Train First Time: ${submitFirstTime}`);
  console.log(`Train Frequency: ${submitFrequency}`);

  database.ref().push({
    TrainName: submitTrainName,
    Destination: submitDestination,
    Frequency: submitFrequency,
    FirstTime: submitFirstTime,
  })

 getTimes();

});

// This funnction pull data from Firebase on add it to the Current Schedule table
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val().TrainName);
  console.log(childSnapshot.val().Destination);
  console.log(childSnapshot.val().Frequency);
  console.log(childSnapshot.val().FirstTime);
  submitFirstTime = childSnapshot.val().FirstTime;
  submitFrequency = childSnapshot.val().Frequency;

  getTimes();

  console.log(mintuesUntilTrain);
  console.log(nextTrain);

  var tRow = $("<tr>");
  tRow.append("<td>"+ childSnapshot.val().TrainName + "</td><td>"+  childSnapshot.val().Destination + "</td><td>"+ childSnapshot.val().Frequency + "</td><td>"+ nextTrain +"</td><td>"+ parseInt(mintuesUntilTrain) +"</td></tr>");
  $("#previousSubmissions").append(tRow);
})