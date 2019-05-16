import { html } from 'orison';

export default (currentPath, root) => html`
  <nav>
    <div>
      <a href="/" class="${currentPath === '/' ? 'active' : ''}">Shop</a>
      ${root.children.filter(child => ! child.data.hideInNav).sort((c1, c2) => c1.data.orison.order - c2.data.orison.order).map(child => html`
        <a href="${child.path}" class="${currentPath.startsWith(child.path) ? 'active' : ''} ${child.data.cssClass ? child.data.cssClass : ''}">${child.data.title}</a>
      `)}
    </div>
  </nav>
`;
