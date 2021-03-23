import sanitizeHtml from 'sanitize-html';
import parser from 'react-html-parser';
import { compose, curryN, __ } from 'ramda';

const curriedSanitizer = curryN(2, sanitizeHtml);
const sanitize = curriedSanitizer(__, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat('iframe'),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    iframe: ['src', 'frameborder', 'width', 'height']
  },
  allowedIframeHostnames: ['www.google.com']
});

const safeRenderHtml = compose(parser, sanitize);

export default safeRenderHtml;
