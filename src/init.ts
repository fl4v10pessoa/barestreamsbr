import { createAddonInterface } from "./addon.js";
import { initRedis } from "./cache/redis.js";
import { config } from "./config.js";
import { enableHttp2IfAvailable } from "./httpClient.js";
import { ensureImdbDatasets } from "./imdb/index.js";
import "./scrapers/registerFlareSolverrPools.js";
import { initFlareSolverrSessions } from "./scrapers/http.js";
import { ensureTrackers } from "./trackers/index.js";

let addonInterfaceCache: ReturnType<typeof createAddonInterface> | null = null;
let initialized = false;

export const getAddonInterface = async () => {
	if (addonInterfaceCache && initialized) {
		return addonInterfaceCache;
	}

	try {
		const redisClient = await initRedis();
		if (!redisClient) {
			console.info("No Redis URL configured, continuing without cache");
		}
	} catch {
		console.info("Redis unavailable, continuing without cache");
	}

	if (config.flareSolverrUrl) {
		try {
			await initFlareSolverrSessions();
		} catch (err) {
			console.warn("FlareSolverr initialization failed:", err);
		}
	}

	try {
		await ensureImdbDatasets();
	} catch (err) {
		console.warn("IMDB datasets initialization failed:", err);
	}

	try {
		await ensureTrackers();
	} catch (err) {
		console.warn("Trackers initialization failed:", err);
	}

	enableHttp2IfAvailable();

	addonInterfaceCache = createAddonInterface();
	initialized = true;

	return addonInterfaceCache;
};
