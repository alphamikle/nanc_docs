const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

module.exports = {
  title: 'Nanc',
  tagline: 'Next gen CMS from the Future',
  favicon: 'favicon.ico',
  url: 'https://nanc.io',
  baseUrl: '/',
  organizationName: 'Nanc Inc.',
  projectName: 'nanc',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en', locales: ['en'],
  },
  presets: [['classic', {
    docs: {
      sidebarPath: require.resolve('./sidebars.js'), editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
    }, blog: {
      showReadingTime: true, editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
    }, theme: {
      customCss: require.resolve('./src/css/custom.css'),
    },
  }]],

  themeConfig: {
    navbar: {
      title: 'Nanc', logo: {
        alt: 'Logo', src: 'img/logo.png',
      }, items: [{
        type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: 'Docs',
      }, {
        to: '/blog', label: 'Blog', position: 'left',
      }, {
        href: 'https://github.com/alphamikle/nanc', label: 'GitHub', position: 'right',
      }],
    }, footer: {
      style: 'dark', links: [{
        title: 'Docs', items: [{
          label: 'Tutorial', to: '/docs/intro',
        }],
      }, {
        title: 'Community', items: [{
          label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        }, {
          label: 'Discord', href: 'https://discordapp.com/invite/docusaurus',
        }, {
          label: 'Twitter', href: 'https://twitter.com/docusaurus',
        }],
      }, {
        title: 'More', items: [{
          label: 'Blog', to: '/blog',
        }, {
          label: 'GitHub', href: 'https://github.com/facebook/docusaurus',
        }],
      }], copyright: `Copyright © ${new Date().getFullYear()} Nanc Inc.`,
    }, prism: {
      theme: lightCodeTheme, darkTheme: darkCodeTheme,
      additionalLanguages: ['dart', 'yaml', 'json5', 'sql'],
    },
  },
};
