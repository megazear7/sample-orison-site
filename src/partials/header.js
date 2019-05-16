import { html } from 'orison';

export default (title, disabled) => html`
  <header>
    <h1>${title}</h1>
    ${ disabled ? html`
      <h2>
        This site is currently disabled.
        <br>
        DO NOT USE
      </h2>
    ` : ''}
    <!-- <img src="/icons/icon-256x256.png"> -->
  </header>
`;
