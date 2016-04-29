$($(function() {
  
  var modo = 'Github';
  
  if (window.location.host == "127.0.0.1:4000")
  {
    modo = 'server';
  }


  CMS.init({

    // Name of your site or location of logo file ,relative to root directory (img/logo.png)
    siteName: 'CMS.JS THEMES',

    // Tagline for your site
    siteTagline: ' The simple theme for cms.js',

    // Email address
    siteEmail: 'your_email@example.com',

    // Name
    siteAuthor: 'CaiCai',

    // Navigation items
    siteNavItems: [
      { name: 'About'},
      { name: 'Github', href: 'https://github.com/hi-caicai', newWindow: false}

    ],

    // Posts folder name
    postsFolder: 'posts',

    // Homepage posts snippet length
    postSnippetLength: 120,

    // Pages folder name
          pagesFolder: 'pages',

          // Order of sorting (true for newest to oldest)
          sortDateOrder: true,

    // Site fade speed
    fadeSpeed: 300,

    // Site footer text
    footerText:'Designed and Coded by CaiCai',

    // Mode 'Github' for Github Pages, 'Apache' for Apache server. Defaults
    // to Github
    mode: modo,

    // If Github mode is set, your Github username and repo name. Defaults
    // to Github pages branch (gh-pages)
    githubUserSettings: {
      username: 'hi-caicai',
      repo: 'cms.js-themes'
    }

  });

  // Markdown settings
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });

});
