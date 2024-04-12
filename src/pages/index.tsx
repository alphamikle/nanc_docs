import React from 'react';
import Link from '@docusaurus/Link';
import posthog from 'posthog-js'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

posthog.init('phc_u5QVDkHQ1UEt01A6Wm0o66EZVM6Jgi0FhmxbFSuhqKg', { api_host: 'https://app.posthog.com' })

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <div className="cl cl-cnt">
      <img src={'/img/name.svg'} alt="Nanc Dark" className={'lg-name'}/>
      <img src={'/img/name_light.svg'} alt="Nanc Light" className={'lg-name-light'}/>
      <p className="hero__subtitle">{siteConfig.tagline}</p>
      <div className={styles.buttons}>
        <Link
          className="button button--secondary button--lg"
          to="/docs/introduction">
          Intro - 5min ⏱️
        </Link>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout description="Nanc - is the backend-agnostic CMS with powerful Backend Driven UI engine for Flutter apps">
      <div className="cl cl-cnt">
        <HomepageHeader/>
        <main>
          <HomepageFeatures/>
        </main>
        <div className="cl"></div>
      </div>
    </Layout>
  );
}
