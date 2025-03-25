/**
 * ResearchSpace
 * Copyright (C) 2020, © Trustees of the British Museum
 * Copyright (C) 2015-2020, metaphacts GmbH
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
package org.researchspace.rest.endpoint;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.eclipse.rdf4j.model.IRI;
import org.eclipse.rdf4j.model.Literal;
import org.eclipse.rdf4j.model.ValueFactory;
import org.eclipse.rdf4j.model.impl.SimpleValueFactory;
import org.eclipse.rdf4j.rio.helpers.NTriplesUtil;
import org.researchspace.cache.LabelCache;
import org.researchspace.data.json.JsonUtil;
import org.researchspace.repository.RepositoryManager;
import org.researchspace.services.fields.FieldDefinition;
import org.researchspace.services.fields.FieldDefinitionManager;
import org.researchspace.services.fields.FieldsBasedSearch;
import org.researchspace.services.fields.SearchRelation;

/**
 * Endpoint for retrieval of {@link FieldDefinition}s
 * 
 * Usage:
 * <ul>
 * <li><code>POST /rest/fields/definitions</code> with a JSON body of the form
 * <code>{ "fields": [ "iri1", "iri2" ] }</code> retrieves field definitions for
 * the given field identifiers.</li>
 * </ul>
 * 
 * @author Jeen Broekstra <jb@metaphacts.com>
 *
 */
@Path("fields")
@Singleton
public class FieldEndpoint {

    private static final Logger logger = LogManager.getLogger(FieldEndpoint.class);

    @Inject
    private FieldDefinitionManager fieldDefinitionManager;

    @Inject
    private RepositoryManager repositoryManager;

    @Inject
    private FieldsBasedSearch fieldsBasedSearch;

    @Inject
    private LabelCache labelCache;

    @POST()
    @Path("definitions")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RequiresAuthentication
    public Response postForFields(Map<String, List<String>> body) {
        try {
            List<IRI> fields = body == null ? new ArrayList<>() : asIRIs(body.get("fields"));
            logger.trace("POST request for field definitions {}", fields);

            return handleFieldDefinitionsRequest(fields);
        } catch (IllegalArgumentException e) {
            return Response.status(Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    private Response handleFieldDefinitionsRequest(List<IRI> fields) {
        final Map<IRI, FieldDefinition> definitions = fields.isEmpty()
                ? fieldDefinitionManager.queryAllFieldDefinitions()
                : fieldDefinitionManager.queryFieldDefinitions(fields);

        List<Map<String, Object>> json = definitions.values().stream()
                .map(field -> fieldDefinitionManager.jsonFromField(field)).collect(Collectors.toList());
        return Response.ok(json).build();
    }

    @POST()
    @Path("generateSearchConfigForFields")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public String generateSearchConfigForFields(List<String> fieldIris) {
        Map<IRI, FieldDefinition> fields = fieldDefinitionManager.queryFieldDefinitions(asIRIs(fieldIris));

        Map<String, SearchRelation> relations = new LinkedHashMap<>();
        for (FieldDefinition field : fields.values()) {

            Optional<Literal> label = labelCache.getLabel(field.getIri(), repositoryManager.getAssetRepository(), null);

            String fieldLabel = LabelCache.resolveLabelWithFallback(label, field.getIri());

            SearchRelation relation = this.fieldsBasedSearch.relationFromField(field, fieldLabel);
            if (!relation.domain.isEmpty() && !relation.range.isEmpty()) {
                relations.put(NTriplesUtil.toNTriplesString(relation.id), relation);
            } else {
                throw new RuntimeException("Domain or Range is unknown for the field - " + relation.id);
            }
        }

        Map<String, Object> result = this.fieldsBasedSearch.generateSearchConfig(relations, null);

        return JsonUtil.prettyPrintJson(result);
    }

    private List<IRI> asIRIs(List<String> input) throws IllegalArgumentException {
        if (input == null) {
            return new ArrayList<IRI>();
        }
        final ValueFactory vf = SimpleValueFactory.getInstance();
        return input.stream().map(s -> vf.createIRI(s)).collect(Collectors.toList());
    }

}
