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

package org.researchspace.ui.templates;

import java.io.IOException;
import java.util.Map;

import javax.inject.Inject;

import org.researchspace.config.Configuration;
import org.researchspace.rest.endpoint.TemplateEndpoint;
import org.researchspace.services.storage.api.ObjectKind;
import org.researchspace.services.storage.api.PlatformStorage;
import org.researchspace.services.storage.api.StoragePath;
import org.researchspace.templates.FromStorageLoader;
import org.researchspace.templates.HbsContext;

import com.google.common.collect.Maps;
import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.cache.ConcurrentMapTemplateCache;
import com.github.jknack.handlebars.io.TemplateLoader;
import com.google.inject.Singleton;

/**
 * Provides ability to render page layout templates (i.e. header, footer, etc)
 * with different input properties. Page layout templates are resolved from
 * {@link PlatformStorage} as {@link ObjectKind#CONFIG} objects with
 * {@link #TEMPLATE_OBJECT_PREFIX} and ".hbs" extension.
 *
 * @author Artem Kozlov <ak@metaphats.com>
 * @author Johannes Trame <jt@metaphats.com>
 */
@Singleton
public class ST {
    private static final StoragePath TEMPLATE_OBJECT_PREFIX = ObjectKind.CONFIG.resolve("page-layout");

    private final Configuration config;
    private final Handlebars handlebars;

    @Inject
    public ST(Configuration config, PlatformStorage platformStorage) {
        this.config = config;
        TemplateLoader templateLoader = new FromStorageLoader(platformStorage) {
            @Override
            protected StoragePath resolveLocation(String location) {
                return objectIdForTemplate(location);
            }
        };
        this.handlebars = new Handlebars().with(new ConcurrentMapTemplateCache()).with(templateLoader);
    }

    public static class TEMPLATES {
        public static final String MAIN = "main";
        public static final String HEADER = "header";
        public static final String FOOTER = "footer";
        public static final String LOGIN_PAGE = "login";
        public static final String HTML_HEAD = "html-head";
        public static final String NO_PERMISSIONS_PAGE = "no-permissions-page";
        public static final String SIDEBAR = "sidebar";
    }

    public static StoragePath objectIdForTemplate(String name) {
        return TEMPLATE_OBJECT_PREFIX.resolve(name).addExtension(".hbs");
    }

    public String renderPageLayoutTemplate(String path, String preferredLanguage) throws IOException {
        HbsContext context = new HbsContext(preferredLanguage, config.getUiConfig().getDeploymentTitle());
        return renderPageLayoutTemplate(path, context);
    }

    public Map<String, Object> getDefaultPageLayoutTemplateParams() {
        Map<String, Object> params = Maps.newHashMap();
        params.put("deploymentTitle", config.getUiConfig().getDeploymentTitle());
        return params;
    }

    public String getDefaultPreferredLanguage() {
        return config.getUiConfig().getPreferredLanguages().get(0);
    }

    /**
     * Returns a compiled template string. The template is loaded from either the
     * app folder or the classpath via the specified path string.
     * 
     * The {@link MainTemplate} will call this method with a special
     * {@code MainTemplateOps} objects as params, whereas the methods
     * {@link TemplateEndpoint#getFooter()} and {@link TemplateEndpoint#getFooter()}
     * will call this method via {@link #renderPageLayoutTemplate(String)} which
     * will automatically inject some configuration parameters as params.
     */
    public String renderPageLayoutTemplate(String path, Object params) throws IOException {
        if (params instanceof HbsContext) {
            return handlebars.compile(path).apply((HbsContext) params);
        }
        return handlebars.compile(path).apply(params);
    }
}
