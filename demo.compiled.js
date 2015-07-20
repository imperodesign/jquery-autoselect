(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

(0, _index2['default'])($);

},{"./index":2}],2:[function(require,module,exports){
'use strict';

module.exports = function ($) {
  var settings = {
    'sort': false,
    'sort-attr': 'data-priority',
    'sort-desc': false,
    'autoselect': true,
    'alternative-spellings': true,
    'alternative-spellings-attr': 'data-alternative-spellings',
    'remove-valueless-options': true,
    'copy-attributes-to-text-field': true,
    'autocomplete-plugin': 'jquery_ui',
    'relevancy-sorting': true,
    'relevancy-sorting-partial-match-value': 1,
    'relevancy-sorting-strict-match-value': 5,
    'relevancy-sorting-booster-attr': 'data-relevancy-booster',
    'minLength': 0,
    'delay': 0,
    'autoFocus': true,
    handle_invalid_input: function handle_invalid_input(context) {
      var selected_finder = 'option:selected:first';
      if (context.settings['remove-valueless-options']) {
        selected_finder = 'option:selected[value!=""]:first';
      }
      context.$text_field.val(context.$select_field.find(selected_finder).text());
    },
    handle_select_field: function handle_select_field($select_field) {
      return $select_field.hide();
    },
    insert_text_field: function insert_text_field(context) {
      var $text_field = $('<input type="text"></input>');
      if (settings['copy-attributes-to-text-field']) {
        var attrs = {};
        var raw_attrs = context.$select_field[0].attributes;
        for (var i = 0; i < raw_attrs.length; i++) {
          var key = raw_attrs[i].nodeName;
          var value = raw_attrs[i].nodeValue;
          if (key !== 'name' && key !== 'id' && typeof context.$select_field.attr(key) !== 'undefined') {
            attrs[key] = value;
          }
        };
        $text_field.attr(attrs);
      }
      $text_field.blur(function () {
        var valid_values = context.$select_field.find('option').map(function (i, option) {
          return $(option).text();
        });
        if ($.inArray($text_field.val(), valid_values) < 0 && typeof settings['handle_invalid_input'] === 'function') {
          settings['handle_invalid_input'](context);
        }
      });
      // give the input box the ability to select all text on mouse click
      if (context.settings['autoselect']) {
        $text_field.click(function () {
          this.select();
        });
      }
      var selected_finder = 'option:selected:first';
      if (context.settings['remove-valueless-options']) {
        selected_finder = 'option:selected[value!=""]:first';
      }
      return $text_field.val(context.$select_field.find(selected_finder).text()).insertAfter(context.$select_field);
    },
    extract_options: function extract_options($select_field) {
      var options = [];
      var $options = $select_field.find('option');
      var number_of_options = $options.length;

      // go over each option in the select tag
      $options.each(function () {
        var $option = $(this);
        var option = {
          'real-value': $option.attr('value'),
          'label': $option.text()
        };
        if (settings['remove-valueless-options'] && option['real-value'] === '') {} else {
          // prepare the 'matches' string which must be filtered on later
          option['matches'] = option['label'];
          var alternative_spellings = $option.attr(settings['alternative-spellings-attr']);
          if (alternative_spellings) {
            option['matches'] += ' ' + alternative_spellings;
          }
          // give each option a weight paramter for sorting
          if (settings['sort']) {
            var weight = parseInt($option.attr(settings['sort-attr']), 10);
            if (weight) {
              option['weight'] = weight;
            } else {
              option['weight'] = number_of_options;
            }
          }
          // add relevancy score
          if (settings['relevancy-sorting']) {
            option['relevancy-score'] = 0;
            option['relevancy-score-booster'] = 1;
            var boost_by = parseFloat($option.attr(settings['relevancy-sorting-booster-attr']));
            if (boost_by) {
              option['relevancy-score-booster'] = boost_by;
            }
          }
          // add option to combined array
          options.push(option);
        }
      });
      // sort the options based on weight
      if (settings['sort']) {
        if (settings['sort-desc']) {
          options.sort(function (a, b) {
            return b['weight'] - a['weight'];
          });
        } else {
          options.sort(function (a, b) {
            return a['weight'] - b['weight'];
          });
        }
      }

      // return the set of options, each with the following attributes: real-value, label, matches, weight (optional)
      return options;
    }
  };

  var public_methods = {
    init: function init(customizations) {

      if (/msie/.test(navigator.userAgent.toLowerCase()) && parseInt(navigator.appVersion, 10) <= 6) {

        return this;
      } else {

        settings = $.extend(settings, customizations);

        return this.each(function () {
          var $select_field = $(this);

          var context = {
            '$select_field': $select_field,
            'options': settings['extract_options']($select_field),
            'settings': settings
          };

          context['$text_field'] = settings['insert_text_field'](context);

          settings['handle_select_field']($select_field);

          if (typeof settings['autocomplete-plugin'] === 'string') {
            adapters[settings['autocomplete-plugin']](context);
          } else {
            settings['autocomplete-plugin'](context);
          }
        });
      }
    }
  };

  var adapters = {
    jquery_ui: function jquery_ui(context) {
      // loose matching of search terms
      var filter_options = function filter_options(term) {
        var split_term = term.split(' ');
        var matchers = [];
        for (var i = 0; i < split_term.length; i++) {
          if (split_term[i].length > 0) {
            var matcher = {};
            matcher['partial'] = new RegExp($.ui.autocomplete.escapeRegex(split_term[i]), 'i');
            if (context.settings['relevancy-sorting']) {
              matcher['strict'] = new RegExp('^' + $.ui.autocomplete.escapeRegex(split_term[i]), 'i');
            }
            matchers.push(matcher);
          }
        };

        return $.grep(context.options, function (option) {
          var partial_matches = 0;
          if (context.settings['relevancy-sorting']) {
            var strict_match = false;
            var split_option_matches = option.matches.split(' ');
          }
          for (var i = 0; i < matchers.length; i++) {
            if (matchers[i]['partial'].test(option.matches)) {
              partial_matches++;
            }
            if (context.settings['relevancy-sorting']) {
              for (var q = 0; q < split_option_matches.length; q++) {
                if (matchers[i]['strict'].test(split_option_matches[q])) {
                  strict_match = true;
                  break;
                }
              };
            }
          };
          if (context.settings['relevancy-sorting']) {
            var option_score = 0;
            option_score += partial_matches * context.settings['relevancy-sorting-partial-match-value'];
            if (strict_match) {
              option_score += context.settings['relevancy-sorting-strict-match-value'];
            }
            option_score = option_score * option['relevancy-score-booster'];
            option['relevancy-score'] = option_score;
          }
          return !term || matchers.length === partial_matches;
        });
      };
      // update the select field value using either selected option or current input in the text field
      var update_select_value = function update_select_value(option) {
        if (option) {
          if (context.$select_field.val() !== option['real-value']) {
            context.$select_field.val(option['real-value']);
            context.$select_field.change();
          }
        } else {
          var option_name = context.$text_field.val().toLowerCase();
          var matching_option = { 'real-value': false };
          for (var i = 0; i < context.options.length; i++) {
            if (option_name === context.options[i]['label'].toLowerCase()) {
              matching_option = context.options[i];
              break;
            }
          };
          if (context.$select_field.val() !== matching_option['real-value']) {
            context.$select_field.val(matching_option['real-value'] || '');
            context.$select_field.change();
          }
          if (matching_option['real-value']) {
            context.$text_field.val(matching_option['label']);
          }
          if (typeof context.settings['handle_invalid_input'] === 'function' && context.$select_field.val() === '') {
            context.settings['handle_invalid_input'](context);
          }
        }
      };
      // jQuery UI autocomplete settings & behavior
      context.$text_field.autocomplete({
        'minLength': context.settings['minLength'],
        'delay': context.settings['delay'],
        'autoFocus': context.settings['autoFocus'],
        source: function source(request, response) {
          var filtered_options = filter_options(request.term);
          if (context.settings['relevancy-sorting']) {
            filtered_options = filtered_options.sort(function (a, b) {
              if (b['relevancy-score'] == a['relevancy-score']) {
                return b['label'] < a['label'] ? 1 : -1;
              } else {
                return b['relevancy-score'] - a['relevancy-score'];
              }
            });
          }
          response(filtered_options);
        },
        select: function select(event, ui) {
          update_select_value(ui.item);
        },
        change: function change(event, ui) {
          update_select_value(ui.item);
        }
      });
      // force refresh value of select field when form is submitted
      context.$text_field.parents('form:first').submit(function () {
        update_select_value();
      });
      // select current value
      update_select_value();
    }
  };

  $.fn.autoselect = function (method) {
    if (public_methods[method]) {
      return public_methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return public_methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.fn.autoselect');
    }
  };
};

// skip options without a value

},{}]},{},[1]);
