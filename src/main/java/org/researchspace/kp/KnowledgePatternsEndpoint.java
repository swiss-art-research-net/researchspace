package org.researchspace.kp;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.GET;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;

import org.eclipse.rdf4j.model.IRI;
import org.eclipse.rdf4j.model.Literal;
import org.researchspace.cache.LabelCache;

import org.researchspace.repository.RepositoryManager;
import org.researchspace.services.fields.FieldDefinition;
import org.researchspace.services.fields.FieldDefinitionManager;

/**
 * @author Artem Kozlov <artem@rem.sh>
 */
@Path("kp")
@Singleton
public class KnowledgePatternsEndpoint {

    @Inject
    private KnowledgePatternGenerator pg;

    @Inject
    private KnowledgeMapConfigGenerator cg;

    @Inject
    private FieldDefinitionManager fieldDefinitionManager;

    @Inject
    private RepositoryManager repositoryManager;

    @Inject
    private LabelCache labelCache;


    @GET
    public Response test() {
        return Response.ok("it works").build();
    }

    @POST
    @Path("/generateKps")
    public Response generateKps(@QueryParam("ontologyIri") IRI ontologyIri) {
        pg.generateKnowledgePatternsFromOntology(ontologyIri);
        return Response.ok().build();
    }

    @GET
    @Path("/getGeneratedKpsAndResponse")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGeneratedKps(@QueryParam("ontologyIri") IRI ontologyIri) {
        int numberOfKPsGenerated = pg.generateKnowledgePatternsFromOntology(ontologyIri);

        Map<String, Object> json = new HashMap<String, Object>();;
        json.put("kp_count", numberOfKPsGenerated);
        return Response.ok().entity(json).build();
    }


    @GET
    @Path("/generateKmConfig")
    public Response generateKmConfig() {
        return Response.ok(cg.generateKmConfig())
            .header("content-disposition", "attachment; filename = authoring-config.html")
            .build();
    }

    @GET
    @Path("/getAllKps")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllKps() {
        Map<IRI, FieldDefinition> fields = fieldDefinitionManager.queryAllFieldDefinitions();
    	Map<IRI, Optional<Literal>> labels = labelCache.getLabels(fields.keySet(), repositoryManager.getAssetRepository(), null);
    	 
        Map<String, Object> jsonDefinitions = new HashMap<String, Object>();
        for (Map.Entry<IRI, FieldDefinition> entry : fields.entrySet()) {
            FieldDefinition field = entry.getValue();
            Map<String, Object> json = fieldDefinitionManager.jsonFromField(field);
            json.put("id", entry.getKey().stringValue());
            String fieldLabel = LabelCache.resolveLabelWithFallback(labels.get(field.getIri()), field.getIri());
            json.put("label", fieldLabel);
            jsonDefinitions.put(field.getIri().stringValue(), json);
        }
    	
    	return Response.ok().entity(jsonDefinitions).build();
    }

}