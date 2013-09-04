/*-*- coding:utf-8; mode:javascript; -*-*/

'use strict';

(angular
 .module('app.controllers', ['ng', 'ngResource'])
 .controller('indexContr', [
     /******/ '$scope',
     function ($scope) {
        var garments = document.getElementById('garments');
        var mannequin = document.getElementById('mannequin');
        var selected = [];

        var items = garments.querySelectorAll('div');

        for (var i = 0; i < items.length; i++) {
            var el = items[i];

            el.setAttribute('draggable', 'true');
            el.addEventListener('dragstart', function (e) {
                if (selected.indexOf(this.id) < 0) {
                    e.dataTransfer.effectAllowed = 'copy';
                    e.dataTransfer.setData('text/plain', this.id);
                    e.dataTransfer.setDragImage(el, -10, -10);
                }
            });
        }

        garments.addEventListener('dragenter', function (e) {
            e.dataTransfer.dropEffect = 'copy';
            return false;
        });

        garments.addEventListener('dragleave', function () {
        });

        garments.addEventListener('dragover', function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        });

        garments.addEventListener('drop', function (e) {
            var id = e.dataTransfer.getData('text/plain');
            var index = selected.indexOf(id);

            if (index >= 0) {
                var el = mannequin.querySelector('#' + id);

                if (el) {
                    el.parentNode.removeChild(el);
                }
                selected.splice(index, 1);
                garments.querySelector('#' + id).setAttribute('draggable', 'true');
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            return false;
        });

        mannequin.addEventListener('dragenter', function (e) {
            e.dataTransfer.dropEffect = 'copy';
            return false;
        });

        mannequin.addEventListener('dragleave', function () {
        });

        mannequin.addEventListener('dragover', function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        });

        mannequin.addEventListener('drop', function (e) {
            var id = e.dataTransfer.getData('text/plain');

            if (id && selected.indexOf(id) < 0) {
                var el = document.getElementById(id);

                if (el) {
                    el.removeAttribute('draggable');
                    selected.push(id);

                    var clone = el.cloneNode(true);

                    clone.setAttribute('draggable', 'true');
                    clone.addEventListener('dragstart', function (e) {
                        e.dataTransfer.effectAllowed = 'copy';
                        e.dataTransfer.setData('text/plain', this.id);
                    });
                    this.appendChild(clone);
                }
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            return false;
        });
     }
 ])
);
