import { html } from 'orison';

export default async blogs => html`
  ${blogs.map(blog => html`
    <section class="blog-overview">
      <h2>${blog.fields.title}</h2>
      <div class="small-overview">
        <img alt="${blog.fields.desktopHeroImage.fields.description}"
             src="${blog.fields.desktopHeroImage.fields.file.url}?w=400">
         <p>
          ${blog.fields.description}
          <br>
          <a href="/blog/${blog.fields.slug}.html">Read More</a>
        </p>
      </div>
    </section>
  `)}
`;
