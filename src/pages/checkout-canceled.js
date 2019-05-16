import { html } from 'orison';

export default async context => html`
  <section>
    <h2>All Good!</h2>
    <p>Come back any time</p>
    <script>document.querySelector('main').scrollIntoView({behavior: 'smooth'});</script>
  </section>
`;
