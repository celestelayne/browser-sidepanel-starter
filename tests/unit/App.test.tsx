import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import App from '../../entrypoints/sidepanel/App';

describe('side panel shell', () => {
  const html = renderToStaticMarkup(<App version="1.2.3" />);

  it('renders a single h1 in the main region', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toMatch(/<main[^>]*>[\s\S]*<h1[^>]*>Welcome<\/h1>[\s\S]*<\/main>/);
    expect(html).toContain('Your side panel is ready.');
  });

  it('renders the three quick start steps in order', () => {
    const list = html.match(/<ol[^>]*>[\s\S]*<\/ol>/)?.[0] ?? '';
    expect(list.match(/<li[\s>]/g)).toHaveLength(3);
    expect(list.indexOf('Create a slice')).toBeLessThan(list.indexOf('Implement'));
    expect(list.indexOf('Implement')).toBeLessThan(list.indexOf('Review'));
  });

  it('renders the next step with the create-slice command', () => {
    expect(html).toMatch(/Next step[\s\S]*<code>\/create-slice &lt;slice-name&gt;<\/code>/);
  });

  it('shows the version passed in the footer', () => {
    expect(html).toMatch(/<footer[^>]*>[\s\S]*v1\.2\.3[\s\S]*<\/footer>/);
  });

  it('has one button and no links or form fields', () => {
    expect(html.match(/<button[\s>]/g)).toHaveLength(1);
    expect(html).not.toMatch(/<(a|input|select|textarea)[\s>]/);
  });

  it('starts with an empty copy status', () => {
    expect(html).toMatch(/<p class="copy-status" role="status"><\/p>/);
  });
});
