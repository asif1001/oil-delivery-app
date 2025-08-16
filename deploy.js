const ghpages = require('gh-pages');

ghpages.publish('dist', {
  branch: 'gh-pages',
  repo: 'https://github.com/asif1001/oil-delivery-app.git',
  message: 'Deploy OILDELIVERY app to GitHub Pages'
}, function(err) {
  if (err) {
    console.error('Deployment failed:', err);
  } else {
    console.log('Successfully deployed to GitHub Pages!');
  }
});