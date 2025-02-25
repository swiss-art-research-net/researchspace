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
import * as React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import * as Maybe from 'data.maybe';

import { ModuleRegistry } from 'platform/api/module-loader';
import { Spinner } from 'platform/components/ui/spinner';

import { CodeBlock } from './CodeBlock';
import * as styles from './CodeExample.scss';

interface CodeExampleProps {
  codeText: string;
  showCodeByDefault?: boolean;
  showCopyButton?: boolean;
}

interface State {
  showCode?: boolean;
  renderedCode?: Data.Maybe<React.ReactNode>;
}

/**
 * Component which can be used to create interactive html snippets.
 * With code highlight and copy to clipboard option.
 *
 * @example
 *    <mp-code-example><semantic-table>...</semantic-table></mp-code-example>
 */
export class CodeExample extends React.Component<CodeExampleProps, State> {
  static defaultProps = {
    showCodeByDefault: false,
    showCopyButton: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      showCode: props.showCode,
      renderedCode: Maybe.Nothing<React.ReactNode>(),
    };
  }

  componentDidMount() {
    this.loadCode(this.props.codeText);
  }

  componentWillReceiveProps(props: CodeExampleProps) {
    if (props.codeText !== this.props.codeText) {
      this.loadCode(props.codeText);
    }
  }

  private loadCode(codeText: string) {
    ModuleRegistry.parseHtmlToReact(codeText).then((components) =>
      this.setState({ renderedCode: Maybe.Just(components) })
    );
  }

  render() {
    const { codeText, showCopyButton } = this.props;
    return (
      <div className={styles.holder}>
        <Tabs defaultActiveKey={this.props.showCodeByDefault ? 1 : 2} unmountOnExit={true}>
          <Tab eventKey={1} title="Code">
            <CodeBlock codeText={codeText} showCopyButton={showCopyButton} />
          </Tab>
          <Tab eventKey={2} title="Result">
            {this.state.renderedCode.getOrElse(<Spinner />)}
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default CodeExample;
