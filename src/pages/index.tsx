import React from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <div className="col col-center">
      <img src={ isDark ? '/img/name.svg' : '/img/name_light.svg' } alt="Nanc" className={isDark ? 'logo-name' : 'logo-name-light'}/>
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
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout description="Nanc - is the backend-agnostic CMS with powerful Backend Driven UI engine for Flutter apps">
      <div className="col col-center">
        <HomepageHeader/>
        <main>
          <HomepageFeatures/>
        </main>
        <div className="col"></div>
      </div>
    </Layout>
  );
}
