import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/agate.css';
import taskLists from 'markdown-it-task-lists';
import hashtag from 'markdown-it-hashtag';

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {
        console.log(err);
      }
    }

    return ''; // 使用额外的默认转义
  },
});
md.use(taskLists);
md.use(hashtag, {
  hashtagRegExp: '[^#|\\s]+',
  preceding: '^|\\s',
});

// https://www.npmjs.com/package/markdown-it-hashtag#advanced
md.renderer.rules.hashtag_open = function () {
  return '<span class="tag">';
};

md.renderer.rules.hashtag_close = function () {
  return '</span>';
};

const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

// https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex('target');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    // @ts-ignore
    tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

export default md;
