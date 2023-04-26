import { type AppType } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { SiteFooter } from "~/components/shared/site-footer";
import { SiteHeader } from "~/components/shared/site-header";
import "~/styles/globals.css";
import { api } from "~/utils/api";

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

      <main className="flex min-h-screen w-full flex-col items-center">
        <SiteHeader />
        <Component {...pageProps} />
        <SiteFooter />
      </main>

      <Toaster />
    </>
  );
};

export default api.withTRPC(MyApp);
