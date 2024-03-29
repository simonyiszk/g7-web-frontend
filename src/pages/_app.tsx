import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/700.css";
import "@/styles.css";

import type { AppProps } from "next/app";
import React from "react";

export default function G7App({ Component, pageProps }: AppProps) {
	return (
		<React.StrictMode>
			<Component {...pageProps} />
		</React.StrictMode>
	);
}
