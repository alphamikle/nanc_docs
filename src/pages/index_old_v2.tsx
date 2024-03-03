import React from 'react';
import './app.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";
import styles from "@site/src/pages/index.module.css";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

const Header: React.FC = () => (
  <div className="header">
    <h1>HEADER</h1>
  </div>
);

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction">
            Nanc Intro - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

const Description: React.FC = () => (
  <div className="description">
    <p>Text description block about Nanc</p>
  </div>
);

const Feature: React.FC<{ title: string, children: any }> = ({ title, children }) => (
  <div className="feature">
    <h2 className="feature-title">{title}</h2>
    <p>{children}</p>
  </div>
);

const CMSInstance: React.FC = () => (
  <div className="cms-instance">
    <p>NANC CMS INSTANCE INSIDE</p>
  </div>
);

const DatabaseStructure: React.FC = () => (
  <div className="db-structure">
    <p>DATABASE STRUCTURE</p>
  </div>
);

const MobileApp: React.FC = () => (
  <div className="mobile-app">
    <p>MOBILE APP</p>
  </div>
);

const NancUI: React.FC = () => (
  <div className="nanc-ui">
    <p>NANC UI INSTANCE INSIDE</p>
  </div>
);

const Footer: React.FC = () => (
  <div className="footer">
    <h1>FOOTER</h1>
  </div>
);

const App: React.FC = () => {
  return (
    <Layout>
      <div className="main">
        <Description />
        <div className="cms-db-container">
          <CMSInstance />
          <DatabaseStructure />
        </div>
        <div className="section features">
          <Feature title="Feature 1">Description of Feature 1</Feature>
          <Feature title="Feature 2">Description of Feature 2</Feature>
          <Feature title="Feature 3">Description of Feature 3</Feature>
        </div>
        <div className="section ui-features">
          <MobileApp />
          <NancUI />
        </div>
      </div>
      <Footer />
    </Layout>
  );
}

export default App;
