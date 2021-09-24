require("dotenv").config();

require("geckodriver");
var firefox = require("selenium-webdriver/firefox");

var webdriver = require("selenium-webdriver");
var until = webdriver.until;
var By = webdriver.By;
var Key = webdriver.Key;
var element = webdriver.WebElement;
const profile = process.env.PROFILE;

const {
  getElement,
  getElements,
  getSubElement,
  IsDisplayed,
  waitFor,
} = require("./Utils");

const userDetails = require("./UserDetails");
profiles = userDetails.profiles;

const Login = require("./Login");
const { chooseCar } = require("./CarBookerUtils");

async function CarBooker(startHr, startMin, endHr, endMin, Month, Day) {
  try {
    var options = new firefox.Options();
    options.setProfile(profile);
    var builder = new webdriver.Builder().forBrowser("firefox");
    builder.setFirefoxOptions(options);
    driver = builder.build();
    await driver.get("https://ontario.client.reservauto.net/bookCar");

    // Full Screen
    await driver.manage().window().fullscreen();

    // Wait for page load
    await Promise.race([
      waitFor(driver, `.//*[@id="Username"]`),
      waitFor(driver, `.//button[@id='btnlogin']`),
    ]).then(async () => {
      await Login(driver);
      await Book(driver, startHr, startMin, endHr, endMin, Month, Day);
    });

    //return true;
  } catch (e) {
    console.log("ERROR: ", e);
    throw new Error(`ERROR: in Car booker: ${e}`);
  }
}

async function Book(driver, startHr, startMin, endHr, endMin, Month, Day) {
  try {
    await driver.sleep(5000);
    await driver.switchTo().frame(await getElement(driver, `.//iframe`));
    // Choose Date
    await chooseDate(driver, startHr, startMin, endHr, endMin, Month, Day);
    await driver.sleep(4000);
  } catch (e) {
    console.log("ERROR: in Book ", e);
    throw new Error(`ERROR: in Book: ${e}`);
  }
}

async function chooseDate(
  driver,
  startHr,
  startMin,
  endHr,
  endMin,
  Month,
  Day
) {
  const startMonth = await getElement(driver, `.//input[@id="StartMonth"]`);
  await startMonth.clear();
  await startMonth.sendKeys(Month);
  const endMonth = await getElement(driver, `.//input[@id="EndMonth"]`);
  await endMonth.clear();
  await endMonth.sendKeys(Month);

  const startDate = await getElement(driver, `.//input[@id="StartDay"]`);
  await startDate.clear();
  await startDate.sendKeys(Day);
  const endDate = await getElement(driver, `.//input[@id="EndDay"]`);
  await endDate.clear();
  await endDate.sendKeys(Day);

  const startHour = await getElement(driver, `.//select[@id="StartHour"]`);
  await startHour.click();
  await driver.sleep(300);
  const startHrOption = await getSubElement(
    startHour,
    `.//option[@value="${startHr}"]`
  );
  await startHrOption.click();

  const endHour = await getElement(driver, `.//select[@id="EndHour"]`);
  await endHour.click();
  await driver.sleep(300);
  const endHrOption = await getSubElement(
    endHour,
    `.//option[@value="${endHr}"]`
  );
  await endHrOption.click();

  const startMinute = await getElement(driver, `.//select[@id="StartMinute"]`);
  await startMinute.click();
  await driver.sleep(300);
  const startMinOption = await getSubElement(
    startMinute,
    `.//option[@value="${startMin}"]`
  );
  await startMinOption.click();

  const endMinute = await getElement(driver, `.//select[@id="EndMinute"]`);
  await endMinute.click();
  await driver.sleep(300);
  const endMinOption = await getSubElement(
    endMinute,
    `.//option[@value="${endMin}"]`
  );
  await endMinOption.click();

  const station = await getElement(
    driver,
    `.//*[text()[contains(.,'Bishop')]]`
  );
  await station.click();

  const showCars = await getElement(
    driver,
    `.//img[@id="Button_Disponibility"]`
  );
  await showCars.click();

  const acceptCommunautoTerms = await getElement(
    driver,
    `.//input[@id="AcceptCommunautoTerms"]`
  );
  await acceptCommunautoTerms.click();

  const okButton = await getElement(
    driver,
    `.//button[text()[contains(.,'OK')]]`
  );
  await okButton.click();

  try {
    await chooseCar(driver, "Bishop");
  } catch (e) {
    console.log("Bishop Car Error!");
  }

  // Choose Car next page
  const BishopPath = `.//div[@class='tblAv' and .//a[text()[contains(.,'Bishop')]]]`;
  const ReserveButton = `//input[@class='Button_Reservation']`;
  const BishopCar = await getElement(driver, BishopPath + ReserveButton);
}

module.exports = CarBooker;
