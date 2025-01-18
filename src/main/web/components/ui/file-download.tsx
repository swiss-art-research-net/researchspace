/**
 * ResearchSpace
 * Copyright (C) 2022-2024, © Kartography Community Interest Company
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
import * as React from 'react';
import { ReactElement, cloneElement, Children, createFactory } from 'react';
import { Component } from 'platform/api/components';
import { Rdf } from 'platform/api/rdf';
import { refresh, navigateToResource } from 'platform/api/navigation';
import { LoadingBackdrop } from 'platform/components/utils/LoadingBackdrop';

import * as _ from 'lodash';

interface State {
  isLoading: boolean;
}

interface Props {
  /**
   * The GET url that is supposed to return a file (stream).
   */
  downloadUrl: string;
  /**
   * To open the download url with a delay in ms.
   * @default 0
   **/
  delay: number;
  /**
   * 'reload' to refresh the page
   */
  postAction?:  string;
}
/**
 * Opens the given downloadUrl in a new window or tab after a delay.
 * @example
 *  <mp-file-download delay='2000' post-action="reload" download-url="/rest/admin/storages/runtime/zip">
 *    <button class="btn btn-primary btn-sm active">OK. Start Download.</button>
 *  </mp-file-download>
 */
export class FileDownload extends Component<Props, State> {
  static defaultProps = { delay: 0 };

  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      isLoading: false,
    };
  }

  public render() {
    const Backdrop = createFactory(LoadingBackdrop);
    const child = Children.only(this.props.children) as ReactElement<any>;
    const props = {
      onClick: this.download,
    };
    return cloneElement(child, props);
  }

  download = () => {
    const { downloadUrl, postAction, delay } = this.props;
    
    setTimeout(() => {

      window.open(downloadUrl);
      
      if (postAction && postAction === 'reload') {
        refresh();
      }
    }, delay);
  };
}
export default FileDownload;
