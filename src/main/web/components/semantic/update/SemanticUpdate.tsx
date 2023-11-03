/**
 * Copyright (C) 2022, Swiss Art Research Infrastructure, University of Zurich
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
import * as assign from 'object-assign';
import { createElement } from 'react';

import { Cancellation } from 'platform/api/async';
import { Component, ComponentContext } from 'platform/api/components';
import { SparqlClient } from 'platform/api/sparql';

export interface SemanticUpdateConfig {
    query: string;
    id?: string;
}

interface State {
    error: any;
}

export class SemanticUpdate extends Component<SemanticUpdateConfig, State> {

    private cancellation = new Cancellation();

    constructor(props: SemanticUpdateConfig, context: any) {
        super(props, context);
        this.state = {
            error: undefined
        };
    }

    private handleClick() {
        console.log("handleClick");
        this.cancellation.map(
            SparqlClient.executeSparqlUpdate(this.props.query )
        ).observe({
            value: () => {
                console.log("success");
            },
            error: (error) => {
                console.log("error");
                this.setState({ error });
            }
        })
    }

    render() {
        const children = React.Children.only(this.props.children)
        const props = { onClick: () => this.handleClick() }
        return (
            <div>
                { React.cloneElement(children as React.ReactElement, props)}
            </div>
        );
    }
}

export default SemanticUpdate