require("dotenv").config();
const { getElement } = require("./Utils");

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

async function Login(driver) {
  try {
    const userName = await getElement(driver, `.//input[@name="Username"]`);
    await userName.sendKeys(EMAIL);

    const pwd = await getElement(driver, `.//input[@name="Password"]`);
    await pwd.sendKeys(PASSWORD);

    const signInSndButton = await getElement(
      driver,
      `.//button[text()[contains(.,'Sign in')]]`
    );
    await signInSndButton.click();
  } catch (e) {
    throw new Error(`ERROR: Login: ${e}`);
  }
}

module.exports = Login;
