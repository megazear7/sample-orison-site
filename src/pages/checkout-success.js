import { html } from 'orison';

export default async context => html`
  <section>
    <h2>It's on the way!<h2>
    <p>We're confident that you'll love it!</p>
    <script>document.querySelector('main').scrollIntoView({behavior: 'smooth'});</script>
  </section>
`;
