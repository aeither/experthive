import {
  ConnectKitButton,
  ConnectKitProvider,
  getDefaultClient,
} from "connectkit";
import { type AppType } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { WagmiConfig, createClient } from "wagmi";
import { filecoinHyperspace } from "wagmi/chains";
import { SiteFooter } from "~/components/shared/site-footer";
import { SiteHeader } from "~/components/shared/site-header";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import { Polybase } from "@polybase/client";
import { PolybaseProvider } from "@polybase/react";

const polybase = new Polybase({
  defaultNamespace: "nowknown0123",
});

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const chains = [filecoinHyperspace];

const client = createClient(
  getDefaultClient({
    appName: "NowKnown",
    alchemyId,
    chains,
  })
);

const WagmiConnectProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="soft">{children}</ConnectKitProvider>
    </WagmiConfig>
  );
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>NowKnown</title>
        <meta
          name="description"
          content="NowKnown is a marketplace of services for entrepreneurs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PolybaseProvider polybase={polybase}>
        <WagmiConnectProvider>
          <main className="flex min-h-screen w-full flex-col items-center">
            <Toaster />
            <SiteHeader />
            <Component {...pageProps} />
            <SiteFooter />
          </main>
        </WagmiConnectProvider>
      </PolybaseProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
