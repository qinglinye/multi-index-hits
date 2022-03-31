/* global instantsearch algoliasearch */

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
});

const qs = instantsearch.widgets.panel({
  templates: {
    header: 'Query Sugguestion',
  },
  hidden({ hits }) {
    return hits.length === 0;
  },
})(instantsearch.widgets.hits);

search.addWidgets([
  instantsearch.widgets.configure({
    hitsPerPage: 4,
  }),

  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),

  instantsearch.widgets.hits({
    container: '#hits-instant-search',
    templates: {
      item: `
      <div>
        <img src="{{image}}" alt="{{name}}" />
        <div class="hit-name">
          {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
        </div>
        <div class="hit-description">
          {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
        </div>
      </div>
    `,
    },
  }),

  instantsearch.widgets.pagination({
    container: '#pagination',
  }),

  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'categories',
  }),

  instantsearch.widgets
    .index({ indexName: 'instant_search_demo_query_suggestions' })
    .addWidgets([
      instantsearch.widgets.configure({
        hitsPerPage: 6,
      }),

      qs({
        container: '#hits-query-suggestion',
        templates: {
          empty: '',
          item:
            '{{#helpers.highlight}}{ "attribute": "query" }{{/helpers.highlight}}',
        },
      }),
    ]),
]);

search.start();

search.on('render', () => {
  const container = document.getElementById('hits-query-suggestion');
  const querySuggestions = container.querySelectorAll('.ais-Hits-item');
  if (querySuggestions.length > 0) {
    querySuggestions.forEach(item => {
      item.addEventListener('click', event => {
        search.helper.setQuery(event.target.innerText).search();
      });
    });
  }
});
