import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Created by professionals',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Nanc is built by developers, content managers
        and product owners with deep experience in building products
        that need to change content and do it often.
      </>
    ),
  },
  {
    title: 'Very fast start',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        You can get a complete CMS for your existing project can be in minutes or hours.
        And you won't have to rewrite anything, or adjust to Nanc.
        Nanc - will adjust to your project.
      </>
    ),
  },
  {
    title: 'Incredible power',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Nanc gives you access to one of the most powerful toolkit for building applications in the Backend Driven UI paradigm.
        You'll be able to change any aspect of your mobile app on the fly - without republishing to the Stores, in the blink of an eye.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
