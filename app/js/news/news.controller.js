(function() {
  'use strict';
  angular.module('cityInfo.news').controller('NewsController', NewsController);

  NewsController.$inject = ['$http'];

  function NewsController($http) {
    var vm = this;
    vm.news= [];

    $http.get('https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=4fd9c090e8c04c9f983076ed474461cd')
		.success(function (response) {
		  //console.log(response);
      angular.forEach(response.articles,function (newsArticle) {
        vm.news.push(newsArticle)
      })
    })
    .error(function () {
      console.log("get news failed");
    })
  }
})();
