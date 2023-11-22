import { IgApiClient } from "instagram-private-api";
import { withFbnsAndRealtime } from 'instagram_mqtt';
import fsAsync from "fs/promises";
import fs from 'fs'
import "dotenv/config";

const SESSION_PATH = "session.json";

export const sessionSaveFileExists = (): boolean => {
  return (fs.existsSync(SESSION_PATH))
}

const saveSession = async (sessionData: any) => {
  try {
    await fsAsync.writeFile(SESSION_PATH, JSON.stringify(sessionData));
  } catch (error) {
    console.error(error)
  }
};

const getUserIdFromCookies = (cookies: any): number=> {
    const USER_ID_COOKIE_KEY = 'ds_user_id'
    var cookiesArray: any[] = cookies.cookies
    var userId: number = 0

    cookiesArray.forEach(cookie => {
        if (cookie.key == USER_ID_COOKIE_KEY)
            userId = Number(cookie.value)
    })

    return userId
}

const loginAndSaveSession = async (username: string, password: string) => {
  try {
    const ig = withFbnsAndRealtime(new IgApiClient());
    var userId: number = 0;
    ig.state.generateDevice(username);

    ig.request.end$.subscribe(async () => {
      const serialized = await ig.state.serialize();
      delete serialized.constants;
      await saveSession(serialized);
    });


    if (sessionSaveFileExists()) {
      const sessionData = await fsAsync.readFile(SESSION_PATH, "utf8");
      const jsonSessionData = JSON.parse(sessionData);
      const cookies = JSON.parse(jsonSessionData.cookies);
      userId = getUserIdFromCookies(cookies);
      await ig.state.deserialize(jsonSessionData); //returns auth with data about the user
    } else {
      let auth = await ig.account.login(username, password);
      var userId = auth.pk;
    }

    const client = {
      ig: ig,
      userId: userId,
    };
    return client;
  } catch (error) {
    console.error("Failed to log in:", error);
    return null;
  }
};

export const logClientSafe = async (username: string, password: string) => {
  const client = await loginAndSaveSession(username, password);
  return client;
};

export default logClientSafe;
