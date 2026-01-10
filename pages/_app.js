import { WagmiConfig, createConfig } from "wagmi";
import { polygonMumbai, sepolia } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";

import { RpsProvider } from "@/context/RpsContext";
import "@/styles/globals.css";

const config = createConfig(
  getDefaultConfig({
    chains: [sepolia],

    // Required API Keys
    alchemyId: "0YB05pw82Hcy9XURB229iSxTdo4CdN23", // or infuraId
    walletConnectProjectId: "03f7a34eb9ec74413407ed6f27d138fe",

    // Required
    appName: "rps",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <RpsProvider>
        <ConnectKitProvider>
          <Head>
            <title>RPSLK</title>
          </Head>

          <Toaster />

          <Component {...pageProps} />
        </ConnectKitProvider>
      </RpsProvider>
    </WagmiConfig>
  );
}
