/* -*- coding:utf-8; mode:javascript; -*- */

'use strict';

(angular
 .module('app.directives', ['ng'])
 .directive('draggable', function () {
     return {
         restrict: 'A',
         link: function(scope, element, attrs) {
             function expression() {
                 return element.attr('draggable');
             }

             function listener(value) {
                 if (value) {
                     element.bind('dragstart', function (e) {
                         var id = this.id.substring(0, 1) === '_' ? this.id.slice(1) : this.id;
                         e.dataTransfer.effectAllowed = 'copy';
                         e.dataTransfer.setData('text/plain', id);
                         e.dataTransfer.setDragImage(this, -10, -10);
                     });
                 }
                 else {
                     element.unbind('dragstart');
                 }
             }

             scope.$watch(expression, listener);
         }
     };
 })
 .directive('garments', function () {
     function controller($scope) {
         this.dropped = function (id) {
             var item = find_item($scope, function (x) {
                 return x.attr('id') === id && !x.data('moved');
             });
             if (item) {
                 item.removeAttr('draggable');
                 item.data('moved', true);
                 $scope.items_moved.push(item);
                 $scope.$digest();
             }
         }
     }

     function find_item(scope, f) {
         var item = null;
         angular.forEach(scope.items, function (x) {
             if (f(x)) {
                 item = x;
             }
         });
         return item;
     }

     function link(scope, el, attrs) {
         var xs = el.find('div');

         scope.items = [];
         scope.items_moved = [];

         angular.forEach(xs, function (x) {
             var e = angular.element(x);

             if (e.attr('draggable')) {
                 scope.items.push(e);
             }
         });

         el.bind('dragenter', on_dragenter(scope));
         el.bind('dragleave', on_dragleave(scope));
         el.bind('dragover', on_dragover(scope));
         el.bind('drop', on_drop(scope));
     }

     function on_dragenter(scope) {
         return function (e) {
             e.dataTransfer.dropEffect = 'copy';
             return false;
         };
     }

     function on_dragleave(scope) {
         return function (e) {
         };
     }

     function on_dragover(scope) {
         return function (e) {
             if (e.preventDefault) {
                 e.preventDefault();
             }
             return false;
         };
     }

     function on_drop(scope) {
         return function (e) {
             var id = e.dataTransfer.getData('text/plain');
             var item = find_item(scope, function (x) {
                 return x.attr('id') === id && x.data('moved');
             });

             if (item) {
                 item.attr('draggable', true);
                 item.removeData('moved');

                 var index = scope.items_moved.indexOf(item);
                 scope.items_moved.splice(index, 1);
                 scope.$digest();
             }
             if (e.stopPropagation) {
                 e.stopPropagation();
             }
             return false;
         };
     }

     return {
         controller: controller,
         link: link,
         restrict: 'A',
         scope: true
     };
 })
 .directive('mannequin', function () {
     function add_mod(value, delta, count) {
         var n = (value + delta) % count;
         return n < 0 ? count + n : n;
     }

     function find_container(element) {
         var container = element;

         angular.forEach(element.find('div'), function (x) {
             var el = angular.element(x);

             if (el.hasClass('mannequin-container')) {
                 container = el;
             }
         });
         return container;
     }

     function link(scope, element, attrs, garmentsContr) {
         var container = find_container(element);

         container.bind('dragenter', on_dragenter(scope));
         container.bind('dragleave', on_dragleave(scope));
         container.bind('dragover', on_dragover(scope));
         container.bind('drop', on_drop(scope, element, garmentsContr));

         scope.frame_num = 0;

         scope.background_position = function (item) {
             var id = item.id.substring(0, 1) === '_' ? item.id.slice(1) : item.id;
             var positions = {
                 'mannequin': ['-5px -5px', '-36px -5px', '-67px -5px'],
                 'shirt': ['-5px -5px', '-201px -5px', '-5px -251px'],
                 'shorts': ['-5px -5px', '-135px -5px', '-5px -175px']
             };
             var xs = positions[id];
             return xs ? xs[scope.frame_num] : '';
         };
         scope.rotate = function (delta) {
             scope.frame_num = add_mod(scope.frame_num, delta, 3);
         };
     }

     function on_dragenter(scope) {
         return function (e) {
             e.dataTransfer.dropEffect = 'copy';
             return false;
         };
     }

     function on_dragleave(scope) {
         return function (e) {
         };
     }

     function on_dragover(scope) {
         return function (e) {
             if (e.preventDefault) {
                 e.preventDefault();
             }
             return false;
         };
     }

     function on_drop(scope, el, garmentsContr) {
         return function (e) {
             var id = e.dataTransfer.getData('text/plain');
             garmentsContr.dropped(id);

             if (e.stopPropagation) {
                 e.stopPropagation();
             }
             return false;
         };
     }

     return {
         link: link,
         restrict: 'A',
         require: '^garments',
         templateUrl: 'templates/mannequin.html'
     };
 })
);
