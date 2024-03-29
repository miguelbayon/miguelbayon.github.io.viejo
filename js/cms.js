/*
 * CMS.js v1.0.0
 * Copyright 2015 Chris Diana
 * www.cdmedia.github.io/cms.js
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
'use strict';

var CMS = {

  settings: {
    siteName: 'CMS.js',
    siteTagline: 'Your site tagline',
    siteEmail: 'your_email@example.com',
    siteAuthor: 'Your Name',
    siteUrl: '',
    siteNavItems: [
      { name: 'Github', href: '#', newWindow: false },
      { name: 'About' }
    ],
    pagination: 3,
    postsFolder: 'posts',
    postSnippetLength: 120,
    pagesFolder: 'pages',
    fadeSpeed: 300,
    mainContainer: $(document.getElementsByClassName('cms_main')),
    footerContainer: $(document.getElementsByClassName('cms_footer')),
    footerText: '&copy; ' + new Date().getFullYear() + ' All Rights Reserved.',
    parseSeperator: '---',
    postsOnFrontpage: true,
    pageAsFrontpage: '',
    postsOnUrl: '',
    loader: '<div class="loader">Loading...</div>',
    get siteAttributes() {
      return [
        { attr: 'title', value: CMS.settings.siteName },
        { attr: '.cms_sitename', value: CMS.settings.siteName },
        { attr: '.cms_tagline', value: CMS.settings.siteTagline },
        { attr: '.cms_footer_text', value: CMS.settings.footerText }
      ];
    },
    mode: 'Github',
    githubUserSettings: {
      username: 'yourusername',
      repo: 'yourrepo',
    },
    githubSettings: {
      branch: 'gh-pages',
      host: 'https://api.github.com'
    }
  },

  posts: [],
  pages: [],
  loaded: {},



  /**********************************
   *
   *  Funcion extend()
   * 
   **********************************/
  extend: function (target, opts, callback) {
    var next;
    if (typeof opts === 'undefined') {
      opts = target;
      target = CMS;
    }
    for (next in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, next)) {
        target[next] = opts[next];
      }
    }
    callback(); // check user config options
    return target;
  },



  /**********************************
   *
   *  Funcion render()
   * 
   **********************************/
  render: function (url) {
    CMS.settings.mainContainer.html('').fadeOut(CMS.settings.fadeSpeed);
    CMS.settings.footerContainer.hide();

    var type = url.split('/')[0];

    var map = {

      // Main view / Frontpage
      '' : function () {
          CMS.renderPosts();
      },

      // Post view / single view
      '#post' : function () {
        var id = url.split('#post/')[1].trim();
        CMS.renderPost(id);
      },

      // Page view
      '#page' : function () {
        var title = url.split('#page/')[1].trim();
        CMS.renderPage(title);
      }

    };

    if (map[type]) {
      map[type]();
    } else {
      // Error view
      var errorMsg = 'Error loading page.';
      CMS.renderError(errorMsg);
    }
  },



  /**********************************
   *
   *  Funcion renderPage()
   * 
   **********************************/
  renderPage: function (title) {
    $('#listado-posts').hide();
    CMS.pages.sort(function (a, b) { return CMS.settings.sortDateOrder ? b.date - a.date : a.date - b.date; });
    CMS.pages.forEach(function (page) {
      if (page.title == title) {

        var tpl = $(document.getElementById('page-template')).html(),
          $tpl = $(tpl);

        $tpl.find('.page-title').html(page.title);
        $tpl.find('.page-content').html(page.contentData);

        CMS.settings.mainContainer.html($tpl).hide().fadeIn(CMS.settings.fadeSpeed);
      }
    });
    CMS.renderFooter();
  },



  /**********************************
   *
   *  Funcion renderPost()
   * 
   **********************************/
  renderPost: function (id) {
    CMS.posts.forEach(function (post) {
      if (post.id == id) {

        var tpl = $(document.getElementById('post-template')).html(),
          $tpl = $(tpl);

        $tpl.find('.post-title').html(post.title);
        $tpl.find('.post-date').html((post.date.getUTCMonth() + 1) + '/' + post.date.getUTCDate() + '/' +  post.date.getUTCFullYear());
        $tpl.find('.post-content').html(post.contentData);

        CMS.settings.mainContainer.html($tpl).hide().fadeIn(CMS.settings.fadeSpeed);
      }
    });
    CMS.renderFooter();
  },



  /**********************************
   *
   *  Funcion renderPosts()
   * 
   **********************************/
  renderPosts: function () {
    /*CMS.posts.sort(function (a, b) { return CMS.settings.sortDateOrder ? b.date - a.date : a.date - b.date; });
    CMS.posts.forEach(function (post) {
      var tpl = $(document.getElementById('post-template')).html(),
        $tpl = $(tpl);

      var title = '<a href="#">' + post.title + '</a>',
        date = (post.date.getUTCMonth() + 1) + '/' + post.date.getUTCDate() + '/' +  post.date.getUTCFullYear(),
        snippet = post.contentData.split('.')[0] + '.';

      var postLink = $tpl.find('.post-title'),
        postDate = $tpl.find('.post-date'),
        postSnippet = $tpl.find('.post-content');

      postLink.on('click', function (e) {
        e.preventDefault();
        window.location.hash = 'post/' + post.id;
      });

      postLink.html(title);
      postSnippet.html(snippet);
      postDate.html(date);
      CMS.settings.mainContainer.append($tpl).hide().fadeIn(CMS.settings.fadeSpeed);
    });*/
    $('#listado-posts').show();
    $('#page-template').hide();
    CMS.renderFooter();
  },



  /**********************************
   *
   *  Funcion renderFooter()
   * 
   **********************************/
  renderFooter: function () {
    // Delay footer loading while waiting on ajax requests
    setTimeout(function () {
      CMS.settings.footerContainer.fadeIn(CMS.settings.fadeSpeed);
    }, 800);
  },



  /**********************************
   *
   *  Funcion renderError()
   * 
   **********************************/
  renderError: function (msg) {
    var tpl = $(document.getElementById('error-template')).html(),
      $tpl = $(tpl);

    $tpl.find('.error_text').html(msg);

    CMS.settings.mainContainer.html('').fadeOut(CMS.settings.fadeSpeed, function () {
      CMS.settings.mainContainer.html($tpl).fadeIn(CMS.settings.fadeSpeed);
    });
  },



  /**********************************
   *
   *  Funcion contentLoaded()
   * 
   **********************************/
  contentLoaded: function (type) {

    CMS.loaded[type] = true;

    if (CMS.loaded.page && CMS.loaded.post) {

      // Set navigation
      this.setNavigation();

      // Manually trigger on initial load
      $(window).trigger('hashchange');
    }
  },



  /**********************************
   *
   *  Funcion paseContent()
   * 
   **********************************/
  parseContent: function (content, type, file, counter, numFiles) {

    var data = content,
      contentObj = {},
      id = counter,
      date = file.date;

    contentObj.id = id;
    contentObj.date = date;

    // Get content info
    var infoData = data;

    /*$.each(infoData, function (k, v) {
      if (v.length) {
        v.replace(/^\s+|\s+$/g, '').trim();
        var i = v.split(':');
        var val = v.slice(v.indexOf(':')+1);
        k = i[0];

        val = (k == 'date' ? (new Date(val)) : val);

        contentObj[k] = (val.trim ? val.trim() : val);
      }
    });

    // Drop data we don't need
    if (data.length > 1)
      data.splice(0, 2);

    // Put everything back together if broken*/
    var contentData = data;
    contentObj.contentData = marked(contentData);
    
    // Se les fija automaticamente el layout de cada pagina
    // que sera siempre el mismo
    contentObj.layout = "default";
    
    // Se les fija el titulo en funcion del nombre del archivo
    var url;
    if (CMS.settings.mode == 'Github') {
      url = file.name.split(".")[0];
      console.log(file);
      console.log(file.link);      
    } else {
      url = file.name.split(CMS.settings.pagesFolder + "/")[1].split(".")[0];
    }    
    contentObj.title = url;


    switch(type) {
      case 'post':
        CMS.posts.push(contentObj);
        break;
      case 'page':
        CMS.pages.push(contentObj);
        break;
    }

    // Execute after all content is loaded
    if (counter === numFiles) {
      CMS.contentLoaded(type);
    }
  },



  /**********************************
   *
   *  Funcion getContent()
   * 
   **********************************/
  getContent: function (type, file, counter, numFiles) {

    var urlFolder = '',
      url;

    switch(type) {
      case 'post':
        urlFolder = CMS.settings.postsFolder;
        break;
      case 'page':
        urlFolder = CMS.settings.pagesFolder;
        break;
    }

    if (CMS.settings.mode == 'Github') {
      url = file.link;
    } else {
      url = file.name.indexOf(urlFolder) > -1 ? file.name : urlFolder + '/' + file.name;
    }

    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'html',
      success: function (content) {
        CMS.parseContent(content, type, file, counter, numFiles);
      },
      error: function () {
        var errorMsg = 'Error loading ' + type + ' content';
        CMS.renderError(errorMsg);
      }
    });
  },



  /**********************************
   *
   *  Funcion getFiles()
   * 
   **********************************/
  getFiles: function (type) {

    var folder = '',
      url = '';

    switch(type) {
      case 'post':
        folder = CMS.settings.postsFolder;
        break;
      case 'page':
        folder = CMS.settings.pagesFolder;
        break;
    }

    if (CMS.settings.mode == 'Github') {
      var gus = CMS.settings.githubUserSettings,
        gs = CMS.settings.githubSettings;
      url = gs.host + '/repos/' + gus.username + '/' + gus.repo + '/contents/' + folder + '?ref=' + gs.branch;
    } else {
      url = folder;
    }

    $.ajax({
      url: url,
      success: function (data) {

        var files = [],
          linkFiles,
          dateParser = /\d{4}-\d{2}(?:-\d{2})?/; // can parse both 2016-01 and 2016-01-01

        if (CMS.settings.mode == 'Github') {
          linkFiles = data;
        } else {
          linkFiles = $(data).find('a');
        }

        $(linkFiles).each(function (k, f) {

          var filename,
            downloadLink;

          if (CMS.settings.mode == 'Github') {
            filename = f.name;
            downloadLink = f.download_url;
          } else {
            filename = $(f).attr('href');
          }

          if (filename.split('.').pop() === 'md') {
            var file = {};
            file.date = new Date(dateParser.test(filename) && dateParser.exec(filename)[0]);
            file.name = filename;
            if (downloadLink) {
              file.link = downloadLink;
            }
            files.push(file);
          }

        });

        var counter = 0,
          numFiles = files.length;

        if (numFiles > 0) {
          for (var file of files) {
            counter++;
            CMS.getContent(type, file, counter, numFiles);
          }
        } else {
          var errorMsg = 'Error loading ' + type + 's in directory. Make sure ' +
            'there are Markdown ' + type + 's in the ' + type + 's folder.';
          CMS.renderError(errorMsg);
        }
      },
      error: function () {
        var errorMsg;
        if (CMS.settings.mode == 'Github') {
          errorMsg = 'Error loading ' + type + 's directory. Make sure ' +
            'your Github settings are correctly set in your config.js file.';
        } else {
          errorMsg = 'Error loading the ' + type + 's directory. Make sure ' +
            'the ' + type + 's directory is set correctly in config and  ' +
            'the ' + type + 's directory indexing feature is enabled.';
        }
        CMS.renderError(errorMsg);
      }
    });
  },



  /**********************************
   *
   *  Funcion setNavigation()
   * 
   **********************************/
  setNavigation: function () {

    var navBuilder = ['<ul>'];
    CMS.settings.siteNavItems.forEach(function (navItem) {
      if (navItem.hasOwnProperty('href')) {
        navBuilder.push('<li><a href="', navItem.href, '"');
        if (navItem.hasOwnProperty('newWindow') && navItem.newWindow) {
          navBuilder.push('target="_blank"');
        }
        navBuilder.push('>', navItem.name, '</a></li>');
      } else {
        CMS.pages.forEach(function (page) {
          if (navItem.name == page.title) {
            navBuilder.push('<li><a href="#" class="cms_nav_link" id="', navItem.name, '">', navItem.name, '</a></li>');
          }
        });
      }
    });
    navBuilder.push('</ul>');
    var nav = navBuilder.join('');

    $(document.getElementsByClassName('cms_nav')).html(nav);

    // Set onclicks for nav links
    $.each($(document.getElementsByClassName('cms_nav_link')), function (k, link) {
      var title = $(this).attr('id');
      $(this).on('click', function (e) {
        e.preventDefault();
        window.location.hash = 'page/' + title;
      });
    });
  },

  setSiteAttributes: function () {
    CMS.settings.siteAttributes.forEach(function (attribute) {

      var value;

      // Set brand
      if (attribute.attr == '.cms_sitename' && attribute.value.match(/\.(jpeg|jpg|gif|png)$/)) {
        value = '<img src="' + attribute.value + '" />';
      } else {
        value = attribute.value;
      }
      $(attribute.attr).html(value).hide().fadeIn(CMS.settings.fadeSpeed);
    });
  },



  /**********************************
   *
   *  Funcion generateSite()
   * 
   **********************************/
  generateSite: function () {

    this.setSiteAttributes();

    var types = ['post', 'page'];

    CMS.getFiles('page');

    /*
    types.forEach(function (type) {
      CMS.getFiles(type);
    });*/

    // Check for hash changes
    $(window).on('hashchange', function () {
      CMS.render(window.location.hash);
    });
  },



  /**********************************
   *
   *  Funcion init()
   * 
   **********************************/
  init: function (options) {
    if (!(options instanceof Array)) {
      return this.extend(this.settings, options, function () {
        CMS.generateSite();
      });
    }
  }

};
