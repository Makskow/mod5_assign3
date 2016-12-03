(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective () {
	var ddo = {
		templateUrl: 'foundItems.html',
		scope: {
			items: '<',
			onRemove: '&'
		},
	    controller: FoundItemsDirectiveController,
	    controllerAs: 'ctrl',
	    bindToController: true
	};

	return ddo;
}

function FoundItemsDirectiveController () {
	var ctrl = this;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {
	var ctrl = this;

	ctrl.searchTerm = '';
	ctrl.dataLoading = false;

	ctrl.buttonClicked = function () {

		if (ctrl.searchTerm) {
			ctrl.dataLoading = true;

			MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then(function (response) {
				ctrl.found = response;
				ctrl.dataLoading = false;
			});
		}
		else {
			ctrl.found = [];
			ctrl.dataLoading = false;
		}
		
	}

	ctrl.removeItem = function (index) {
		ctrl.found.splice(index, 1);
	}
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService ($http) {
	var service = this;

	service.getMatchedMenuItems = function (searchTerm) {
		return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json').then(function (response) {
			var menuItems = response.data.menu_items;
			var foundItems = [];

			for (var i = 0; i < menuItems.length; i++) {
				if (menuItems[i].name.toLowerCase().indexOf(searchTerm) !== -1) {
					foundItems.push(menuItems[i]);
				}
			}

			return foundItems;
		});
	}
}

})();