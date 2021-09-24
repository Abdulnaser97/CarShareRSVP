const { getElement, waitFor } = require("./Utils");

async function chooseCar(driver, name) {
  try {
    const divPath = `.//div[@class='tblAv' and .//a[text()[contains(.,'${name}')]]]`;
    const reserveButtonPath = `//input[@class='Button_Reservation']`;
    await driver.sleep(2000);
    await waitFor(driver, divPath + reserveButtonPath);

    const reserveButton = await getElement(driver, divPath + reserveButtonPath);

    await reserveButton.click();

    await driver.sleep(2000);
    await waitFor(driver, `.//input[@id='Button_Yes']`);
    const yesButton = await getElement(driver, `.//input[@id='Button_Yes']`);

    await yesButton.click();
  } catch (e) {
    console.log("chooseCar(): ", e);
    throw e;
  }
}

module.exports = {
  chooseCar,
};
