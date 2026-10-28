import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import App from '../../entrypoints/sidepanel/App';

describe('side panel shell', () => {
  const html = renderToStaticMarkup(<App />);

  it('renders the title in a single h1 inside the header', () => {
    expect(html).toMatch(/<header[^>]*>\s*<h1>Browser Side Panel Starter<\/h1>/);
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('renders the placeholder in the main region', () => {
    expect(html).toMatch(/<main[^>]*>[\s\S]*Your side panel is ready\.[\s\S]*<\/main>/);
  });

  it('renders the footer region', () => {
    expect(html).toMatch(/<footer[^>]*>[\s\S]*Made with 💛 in NYC[\s\S]*<\/footer>/);
  });

  it('contains no interactive elements', () => {
    expect(html).not.toMatch(/<(a|button|input|select|textarea)[\s>]/);
  });
});
