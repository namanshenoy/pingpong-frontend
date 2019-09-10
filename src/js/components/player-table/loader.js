define(['ojs/ojcomposite', 'text!./player-table.html', './player-table', 'text!./component.json'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('player-table', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);