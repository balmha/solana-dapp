import '../styles/globals.css';
import '../styles/liquidity.css';
require('@solana/wallet-adapter-react-ui/styles.css');
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import { ContentContainer } from '../components/ContentContainer';
import { Footer } from '../components/Footer';
import Notifications from '../components/Notification';


const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
          <Head>
            <title>SPLForge</title>
          </Head>
          <ContextProvider>
            <div className="flex flex-col h-screen">
              <Notifications/>
              <AppBar/>
              <ContentContainer>
                <Component {...pageProps} />
              </ContentContainer>
              <Footer/>
            </div>
          </ContextProvider>
        </>
    );
};

export default App;
