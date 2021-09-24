const CarBooker = require("./CarBooker");

let startHr, startMin, endHr, endMin, Month, Day;

// print process.argv
process.argv.forEach((val, index) => {
  //console.log(`${index}: ${val}`);
  if (val.includes("startHr=")) {
    startHr = val.substr("startHr=".length + 2);
  } else if (val.includes("startMin=")) {
    startMin = val.substr("startMin=".length + 2);
  } else if (val.includes("endHr=")) {
    endHr = val.substr("endHr=".length + 2);
  } else if (val.includes("endMin=")) {
    endMin = val.substr("endMin=".length + 2);
  } else if (val.includes("Month=")) {
    Month = val.substr("Month=".length + 2);
  } else if (val.includes("Day=")) {
    Day = val.substr("Day=".length + 2);
  }
});

async function CarBookerCLI(startHr, startMin, endHr, endMin, Month, Day) {
  let repeatCounter = 0;
  const maxRepeats = 1;
  let err = false;

  let bookingDay = Day;
  let bookingMonth = Month;
  do {  
    try {

      let 
      if (!bookingDay || !bookingMonth) {
        const today = new Date();
        today.setDate(today.getDate()+30);
        bookingDay = today.getDate();
        bookingMonth = today.getMonth()+1;
      }
      const success = await CarBooker(
        startHr,
        startMin,
        endHr,
        endMin,
        bookingMonth,
        bookingDay
      );

      if (success) {
        console.log(
          `Successfully Booked ${bookingMonth}/${bookingDay} from ${startHr}:${startMin} to ${endHr}:${endMin}`
        );
      }
      err = false;
      return;
    } catch (e) {
      console.log("ERROR: GymBookerCLI: ", e);
      repeatCounter++;
      err = true;
    }
  } while (repeatCounter < maxRepeats && err == true);
}

CarBookerCLI(startHr, startMin, endHr, endMin, Month, Day);

//node CarBookerCLI startHr=12 startMin=15 endHr=16 endMin=00 Month=8 Day=25
