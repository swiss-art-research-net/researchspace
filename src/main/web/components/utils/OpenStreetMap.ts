/**
 * ResearchSpace
 * Copyright (C) 2024, © Kartography Community Interest Company
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import OSM from 'ol/source/OSM';

const OPEN_STREET_MAP_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const OPEN_STREET_MAP_REFERRER_POLICY = 'strict-origin-when-cross-origin';

function loadOpenStreetMapTile(tile, src: string) {
  const image = tile.getImage() as HTMLImageElement;
  image.referrerPolicy = OPEN_STREET_MAP_REFERRER_POLICY;
  image.src = src;
}

export function createOpenStreetMapSource() {
  return new OSM({
    url: OPEN_STREET_MAP_TILE_URL,
    tileLoadFunction: loadOpenStreetMapTile,
  });
}
