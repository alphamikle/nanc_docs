import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type BorderRadiusProps = {
  leftTop?: string;
  rightTop?: string;
  rightBottom?: string;
  leftBottom?: string;
  all?: string;
};

type FeatureItem = {
  title: string;
  img: string;
  description: JSX.Element;
  radius: BorderRadiusProps;
};

function generateRadius({ leftTop, rightTop, rightBottom, leftBottom, all }: BorderRadiusProps): React.CSSProperties {
  return {
    borderTopLeftRadius: leftTop ?? all ?? '0px',
    borderTopRightRadius: rightTop ?? all ?? '0px',
    borderBottomRightRadius: rightBottom ?? all ?? '0px',
    borderBottomLeftRadius: leftBottom ?? all ?? '0px',
  };
}

const def = '75px';
const rad = '150px';

const FeatureList: FeatureItem[] = [
  {
    title: 'Created by professionals',
    img: '/img/feature_1.webp',
    description: (
      <>
        Nanc: Expert-designed CMS for effortless, rapid content updates.
      </>
    ),
    radius: {
      all: rad,
      rightTop: def,
      rightBottom: def,
    },
  },
  {
    title: 'Fast start',
    img: '/img/feature_2.webp',
    description: (
      <>
        Nanc CMS integrates seamlessly, adapting to your project without rewrites.
      </>
    ),
    radius: {
      all: rad,
      leftTop: def,
      leftBottom: def,
    },
  },
  {
    title: 'Incredible power',
    img: '/img/feature_3.webp',
    description: (
      <>
        Nanc offers instant app updates without republishing, powered by a robust toolkit.
      </>
    ),
    radius: {
      all: rad,
      leftBottom: def,
      rightBottom: def,
    },
  },
];

function Feature({title, img, description, radius}: FeatureItem) {
  const radiusStyle = generateRadius(radius);

  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={img} alt="feature" style={{...radiusStyle, marginBottom: '10px'}} height="200px"/>
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
