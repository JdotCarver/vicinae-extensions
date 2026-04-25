import { Color, Icon } from "@vicinae/api";
import { homedir } from "node:os";
import * as path from "node:path";
import * as fsp from "node:fs/promises";

export const expandHome = (p: string) => {
	if (p === "~") return homedir();
	if (p.startsWith("~/")) return path.join(homedir(), p.slice(2));
	return p;
};

export const configHome = () =>
	process.env.XDG_CONFIG_HOME ?? path.join(homedir(), ".config");

export const safeAccess = async (p: string, mode?: number) => {
	try {
		await fsp.access(p, mode);
		return true;
	} catch {
		return false;
	}
};

export const extractHost = (url: string) => {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return null;
	}
};

export const faviconIcon = ({
	url,
	favorite,
	enabled,
}: {
	url: string;
	favorite: boolean;
	enabled: boolean;
}) => {
	const defaultIcon = favorite
		? {
				source: Icon.Star,
				tintColor: Color.Yellow,
			}
		: {
		source: Icon.Bookmark,
	};

	if (!enabled) {
		return defaultIcon;
	}

	const host = extractHost(url);

	if (!host) {
		return defaultIcon;
	}

	return {
		source: `https://icons.duckduckgo.com/ip3/${host}.ico`,
		fallback: favorite ? Icon.Star : Icon.Bookmark,
	};
};
