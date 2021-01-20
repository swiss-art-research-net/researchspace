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

package org.researchspace.security;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;
import javax.inject.Provider;
import javax.inject.Singleton;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.support.DelegatingSubject;
import org.eclipse.rdf4j.model.IRI;
import org.eclipse.rdf4j.model.Model;
import org.eclipse.rdf4j.rio.RDFFormat;
import org.eclipse.rdf4j.rio.RDFParseException;
import org.researchspace.config.NamespaceRegistry;
import org.researchspace.data.rdf.PointedGraph;
import org.researchspace.data.rdf.RioUtils;
import org.researchspace.data.rdf.container.LDPImplManager;
import org.researchspace.data.rdf.container.UserMetadataContainer;
import org.researchspace.repository.MpRepositoryProvider;
import org.researchspace.services.storage.api.ObjectKind;
import org.researchspace.services.storage.api.PlatformStorage;
import org.researchspace.services.storage.api.StoragePath;
import org.researchspace.templates.FromStorageLoader;
import org.researchspace.vocabulary.LDP;

import com.github.jknack.handlebars.Context;
import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Template;
import com.github.jknack.handlebars.context.FieldValueResolver;
import com.google.common.collect.Sets;

import io.buji.pac4j.subject.Pac4jPrincipal;

/**
 * @author Denis Ostapenko
 * @author Artem Kozlov <ak@metaphacts.com>
 */
@Singleton
public class SecurityService {
    private static final Logger logger = LogManager.getLogger(SecurityService.class);

    private final RioUtils rioUtils;
    private final PlatformStorage platformStorage;
    private final Provider<NamespaceRegistry> ns;

    @Inject
    public SecurityService(RioUtils rioUtils, PlatformStorage platformStorage, Provider<NamespaceRegistry> ns) {
        this.rioUtils = rioUtils;
        this.platformStorage = platformStorage;
        this.ns = ns;
    }

    public String renderUsersMetadataToTurtle(UserMetadataProvider userMetadataProvider) throws IOException {
        class UserMetadataGroupOpts {
            public String dn;
            public String cn;
            public String dn_encoded;

            public UserMetadataGroupOpts(String dn, String cn) {
                this.dn = dn;
                this.cn = cn;
                try {
                    this.dn_encoded = URLEncoder.encode(dn, "UTF-8");
                } catch (UnsupportedEncodingException e) {
                }
            }
        }
        class UserMetadataOpts {
            public String USER_NAME;
            public String USER_IRI;
            public Set<UserMetadataGroupOpts> USER_GROUPS;
            public Set<String> USER_ROLES;

            public UserMetadataOpts(String userName, Set<UserMetadata.GroupProps> userGroups, Set<String> userRoles) {
                USER_NAME = userName;
                USER_IRI = "<" + ns.get().getUserIRI(userName).stringValue() + ">";
                USER_GROUPS = new HashSet<>();
                for (UserMetadata.GroupProps userGroup : userGroups) {
                    USER_GROUPS.add(new UserMetadataGroupOpts(userGroup.dn, userGroup.cn));
                }
                USER_ROLES = userRoles;
            }
        }
        List<UserMetadata> users = userMetadataProvider.getUsersMetadata();
        Template userMetadataTemplate = new Handlebars().with(new FromStorageLoader(platformStorage) {
            @Override
            protected StoragePath resolveLocation(String location) {
                return ObjectKind.CONFIG.resolve(location).addExtension(".hbs");
            }
        }).compile("userMetadata");
        StringBuilder response = new StringBuilder();
        for (UserMetadata user : users) {
            Object model = new UserMetadataOpts(user.name, user.groups, user.roles);
            String record = userMetadataTemplate
                    .apply(Context.newBuilder(model).resolver(FieldValueResolver.INSTANCE).build());
            response.append(record);
        }
        return response.toString();
    }

    public void saveUsersMetadataTurtleInContainer(String turtle, MpRepositoryProvider repositoryProvider)
            throws Exception {
        UserMetadataContainer userMetadataContainer = (UserMetadataContainer) LDPImplManager.getLDPImplementation(
                UserMetadataContainer.IRI, Sets.newHashSet(LDP.Container, LDP.Resource), repositoryProvider);
        InputStream input = new ByteArrayInputStream(turtle.getBytes());
        try {
            IRI root = UserMetadataContainer.IRI_ROOT;
            Model model = rioUtils.parse(input, root.stringValue(), RDFFormat.TURTLE);
            userMetadataContainer.update(new PointedGraph(root, model));
        } catch (RDFParseException exception) {
            logger.debug("Generated from userMetadata.hbs Turtle is not valid, it will not be added to database",
                    exception);
        }
    }

    public static String getUserName() {
        Object subject = SecurityUtils.getSubject();
        String userName = "unknown";
        if (subject instanceof String) {
            userName = (String) subject;
            if (StringUtils.isEmpty(userName)) {
                userName = "unknown";
            }
        } else if (subject instanceof DelegatingSubject) {
            Object principal = ((DelegatingSubject) subject).getPrincipal();

            if (principal instanceof Pac4jPrincipal) {
                // userName = ((Pac4jPrincipal) principal).getName();
                userName = "unknown";
            } else if (principal instanceof String) {
                userName = (String) principal;
                if (StringUtils.isEmpty(userName)) {
                    userName = "unknown";
                }
            }
        } else {
            userName = "unknown";
        }
        return userName;
    }
}
