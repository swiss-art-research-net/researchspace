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

import { ReactElement, Props, Children } from 'react';
import { fromNullable } from 'data.maybe';

import { ComponentProps, SemanticContext } from 'platform/api/components';
import { serialize, deserialize } from 'platform/api/json';
import { ComponentClassMetadata } from 'platform/api/module-loader';
import { Rdf, ObjectGraph } from 'platform/api/rdf';
import { rdf, persist, crm } from 'platform/api/rdf/vocabularies';
import { QueryContext } from 'platform/api/sparql';
import { TemplateScope, TemplateScopeProps } from 'platform/api/services/template';
import crmdig from 'platform/data/vocabularies/crmdig';
import platform from '../rdf/vocabularies/platform';

interface RawComponentContext {
  templateProps: TemplateScopeProps;
  semanticContext?: QueryContext;
}

/**
 * Serializes any React DOM element or platform component registered in `component.json`
 * into RDF graph. Component's props must contain only serializable values (primitives,
 * arrays, raw objects).
 *
 * @see ActionSaveComponent
 * @see PersistedComponent
 */
export function componentToGraph(params: {
  /** Serialized component. */
  component: ReactElement<any>;
  /** Pointer to root component structure withing the result graph. */
  componentRoot: Rdf.Node;
  /**
   * Effective template scope from outer React context for the component.
   *
   * This value is available through `PlatformComponent.appliedTemplateScope` of parent component
   * and required if the component uses any templates from parent scope.
   */
  parentTemplateScope?: TemplateScope;
  /** Semantic context from outer React context for the component. */
  semanticContext?: QueryContext;
}): Rdf.PointedGraph {
  const { component, componentRoot, parentTemplateScope, semanticContext } = params;

  const htmlTag =
    typeof component.type === 'string'
      ? component.type
      : typeof component.type === 'function'
      ? (component.type as ComponentClassMetadata).__htmlTag
      : undefined;
  if (!htmlTag) {
    throw new Error('Cannot serialize component with unknown HTML tag');
  }

  const componentNamespace = Rdf.iri(persist.COMPONENT_TYPE_PREFIX + htmlTag);
  const componentP2Type = Rdf.iri(platform._NAMESPACE_VOCABULARY_RESOURCE_TYPE + htmlTag.replace("-","_"));
  type CustomComponentProps = Props<any> & ComponentProps;
  const { markupTemplateScope, children, ...otherProps } = component.props as CustomComponentProps;

  const appliedScope = markupTemplateScope || parentTemplateScope || TemplateScope.default;

  const propsGraph = ObjectGraph.serialize(otherProps, componentNamespace);
  const result = propsGraph.graph.triples.toArray();
  result.push(
    Rdf.triple(componentRoot,rdf.type, crmdig.D1_Digital_Object),
    Rdf.triple(componentRoot, crm.P2_has_type, componentP2Type),
    Rdf.triple(componentRoot, rdf.type, persist.PersistedComponent),
    Rdf.triple(componentRoot, persist.componentType, componentNamespace),
    Rdf.triple(componentRoot, persist.componentProps, propsGraph.pointer)
  );

  if (children && Children.count(children) > 0) {
    const serializedChildren = Children.toArray(children).map((child, index) =>
      componentToGraph({
        component: child as any,
        componentRoot: Rdf.bnode(),
        parentTemplateScope: appliedScope,
      })
    );
    const childrenGraph = ObjectGraph.serializeArray(serializedChildren, (child) => child);
    result.push(...childrenGraph.graph.triples.toArray());
    result.push(Rdf.triple(componentRoot, persist.componentChildren, childrenGraph.pointer));
  }

  if (isCustomElementTag(htmlTag)) {
    const rawContext: RawComponentContext = {
      templateProps: appliedScope.exportProps(),
      semanticContext,
    };
    const contextGraph = ObjectGraph.serialize(serialize(rawContext), persist.componentContext);
    result.push(...contextGraph.graph.triples.toArray());
    result.push(Rdf.triple(componentRoot, persist.componentContext, contextGraph.pointer));
  }

  return Rdf.pg(componentRoot, Rdf.graph(result));
}

export interface DeserializedComponent {
  type: string;
  props: any;
  children: DeserializedComponent[];
}

export interface DeserializationResult {
  component: DeserializedComponent;
  context: SemanticContext;
}

/**
 * Deserializes a platform component from an RDF graph generated by `componentToGraph()`.
 */
export function graphToComponent(root: Rdf.Node, graph: Rdf.Graph): DeserializationResult {
  const componentTypeTriple = graph.triples
    .filter((t) => t.s.equals(root) && t.p.equals(persist.componentType))
    .first();
  if (!componentTypeTriple) {
    throw new Error(`Missing componentType for ${root}`);
  }
  const componentType = componentTypeTriple.o.value;

  const componentPropsTriple = graph.triples
    .filter((t) => t.s.equals(root) && t.p.equals(persist.componentProps))
    .first();
  if (!componentPropsTriple) {
    throw new Error(`Missing componentProps for ${root}`);
  }
  const componentProps = componentPropsTriple.o;

  const componentChildrenRoot = fromNullable(
    graph.triples.filter((t) => t.s.equals(root) && t.p.equals(persist.componentChildren)).first()
  ).map((t) => t.o);
  const componentContextRoot = fromNullable(
    graph.triples.filter((t) => t.s.equals(root) && t.p.equals(persist.componentContext)).first()
  ).map((t) => t.o);

  if (!componentType.startsWith(persist.COMPONENT_TYPE_PREFIX)) {
    throw new Error(`Invalid componentType <${componentType}> for ${root}`);
  }

  const type = componentType.substr(persist.COMPONENT_TYPE_PREFIX.length);
  let props: Props<any> & ComponentProps = ObjectGraph.deserialize(componentProps, graph);
  let children: DeserializedComponent[] = [];
  let context: SemanticContext = { semanticContext: {} };

  if (componentChildrenRoot.isJust) {
    children = ObjectGraph.deserializeArray(componentChildrenRoot.get(), graph, (pointer) => {
      // discard child's context (it should be empty)
      const { component } = graphToComponent(pointer, graph);
      return component;
    });
  }

  if (isCustomElementTag(type) && componentContextRoot.isJust) {
    const { semanticContext, templateProps } = deserialize<RawComponentContext>(
      ObjectGraph.deserialize(componentContextRoot.get(), graph)
    );
    context = { semanticContext };
    props = {
      ...props,
      markupTemplateScope: TemplateScope.create(templateProps),
    };
  }

  const component: DeserializedComponent = {
    type,
    props: props as any,
    children,
  };
  return { component, context };
}

function isCustomElementTag(tagName: string): boolean {
  return tagName.indexOf('-') >= 0;
}
