define(['ojs/ojcomposite', 'text!./card.html', './card', 'text!./component.json'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('demo-card', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);