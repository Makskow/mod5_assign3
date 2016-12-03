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

	ctrl.welcome = "hi";
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {
	var ctrl = this;

	ctrl.searchTerm = '';

	ctrl.buttonClicked = function () {
		ctrl.found = [];
		ctrl.empty = false;

		if (ctrl.searchTerm) {
			MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then(function (response) {
				ctrl.found = response;

				if (ctrl.found.length === 0) {
					ctrl.empty = true;
				}
				else {
					ctrl.empty = false;
				}
			});
		}
		else {
			ctrl.empty = true;
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
		console.log("in service");
		return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json').then(function (response) {
			var menuItems = response.data.menu_items;
			var foundItems = [];

			for (var i = 0; i < menuItems.length; i++) {
				if (menuItems[i].name.toLowerCase().indexOf(searchTerm) !== -1) {
					foundItems.push(menuItems[i]);
				}
			}
			console.log(foundItems);

			return foundItems;
		});
	}
}

})();