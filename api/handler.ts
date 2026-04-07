import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAddonInterface } from "../src/init.js";
import { BadRequestError } from "../src/types.js";

export default async (req: VercelRequest, res: VercelResponse) => {
	// Set CORS headers
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	// Handle OPTIONS requests
	if (req.method === "OPTIONS") {
		res.status(204).end();
		return;
	}

	// Only allow GET requests
	if (req.method !== "GET") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}

	const path = req.url || "/";

	try {
		// Initialize addon interface
		const addonInterface = await getAddonInterface();

		// Handle manifest request
		if (path === "/" || path === "/manifest.json") {
			console.info(`Manifest requested: ${req.method} ${path}`);
			res.status(200).json(addonInterface.manifest);
			return;
		}

		// Handle stream requests
		if (path.startsWith("/stream/")) {
			const parts = path.split("/").filter(Boolean);

			if (parts.length !== 3 || !parts[2].endsWith(".json")) {
				res.status(404).json({ error: "Not found" });
				return;
			}

			const type = parts[1];
			const id = parts[2].slice(0, -5);

			try {
				const result = await addonInterface.get("stream", type, id);
				res.status(200).json(result);
			} catch (err) {
				if (err instanceof BadRequestError) {
					res.status(400).json({ error: err.message });
					return;
				}

				console.error("Stream error:", err);
				res.status(500).json({ error: "Internal server error" });
			}
			return;
		}

		// Handle 404
		res.status(404).json({ error: "Not found" });
	} catch (err) {
		console.error("Handler error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};
