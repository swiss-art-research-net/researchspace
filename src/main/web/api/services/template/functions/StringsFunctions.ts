/**
 * ResearchSpace
 * Copyright (C) 2020, © Trustees of the British Museum
 * Copyright (C) 2015-2019, metaphacts GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export const StringsFunctions = {
  arraySplit: function(text: string) {
    if (typeof text !== 'string') {
      return [];
    }
    try {
      const array = JSON.parse(text);
      if (Array.isArray(array)) {
        return array;
      }
    } catch (e) {
      console.error('Error parsing JSON array:', e);
    }
    return []; 
  },
  extractFilename: function(url) {
    if (typeof url === 'string') {
      // Using a regular expression to remove everything up to and including the last '/'
      return url.replace(/.*\//, '');
    }
    return '';
  },
  split: function(text: string, separator?: string) {
    if (typeof text !== 'string') {
      return [];
    }
    if (typeof separator !== 'string') {
      separator = ' ';
    }
    return text.split(separator);
  }
};
