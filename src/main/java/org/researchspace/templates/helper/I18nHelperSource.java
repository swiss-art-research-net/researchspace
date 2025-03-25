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

package org.researchspace.templates.helper;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.MissingResourceException;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;
import java.util.Locale;
import java.util.Optional;
import javax.inject.Inject;

import org.researchspace.templates.TemplateContext;
import org.researchspace.cache.CacheManager;
import org.researchspace.config.Configuration;
import org.researchspace.services.storage.api.ObjectKind;
import org.researchspace.services.storage.api.PlatformStorage;
import org.researchspace.services.storage.api.StoragePath;

import java.text.MessageFormat;
import org.apache.commons.text.StringEscapeUtils;
import com.github.jknack.handlebars.Options;
import com.github.jknack.handlebars.Handlebars;


public class I18nHelperSource {

    private final Configuration config;
    private final ResourceBundle.Control control;
    public static final String DEFAULT_BUNDLE = "messages";

    @Inject
    public I18nHelperSource(Configuration config, PlatformStorage platformStorage, CacheManager cacheManager) {
        this.config = config;
        this.control = new StorageResourceBundleControl(platformStorage);
    }

    public String getDefaultPreferredLanguage() {
        return config.getUiConfig().getPreferredLanguages().get(0);
    }

    public static class StorageResourceBundleControl extends ResourceBundle.Control {

        private final PlatformStorage platformStorage;

        public StorageResourceBundleControl(PlatformStorage platformStorage) {
            this.platformStorage = platformStorage;
        }

        @Override
        public ResourceBundle newBundle(String baseName, Locale locale, String format,
                                        ClassLoader loader, boolean reload)
                throws IllegalAccessException, InstantiationException, IOException {
            if (!"java.properties".equals(format)) return null;

            String bundleName = toBundleName(baseName, locale);
            String resourceName = bundleName + ".properties";
            Optional<StoragePath> maybePath = StoragePath.tryParse(resourceName);
            if (!maybePath.isPresent()) return null;

            StoragePath storagePath = ObjectKind.I18N.resolve(maybePath.get());

            Optional<PlatformStorage.FindResult> result = platformStorage.findObject(storagePath);
            if (result.isPresent()) {
                try (Reader reader = new InputStreamReader(result.get().getRecord().getLocation().readContent(), StandardCharsets.UTF_8)) {
                    return new PropertyResourceBundle(reader);
                }
            }

            // fallback to classpath
            return super.newBundle(baseName, locale, format, loader, reload);
        }
    }

    public CharSequence i18n(final String key, final Options options) {
        TemplateContext context = (TemplateContext) options.context.model();
        String language = context.getPreferredLanguage().orElse(getDefaultPreferredLanguage());
        String bundleName = options.hash("bundle", DEFAULT_BUNDLE);

        Locale locale = Locale.forLanguageTag(language);
        ResourceBundle bundle;

        try {
            bundle = ResourceBundle.getBundle(bundleName, locale, getClass().getClassLoader(), control);
        } catch (MissingResourceException e) {
            return key + " (bundle not found)";
        }

        if (!bundle.containsKey(key)) {
            return key + " (message key not found)";
        }

        String message = bundle.getString(key);

        Object[] args = options.params;
        if (args != null && args.length > 0) {
            message = new MessageFormat(message, locale).format(args);
        }

        boolean escapeHtml = options.hash("escapeHTML", Boolean.TRUE);
        return escapeHtml
            ? StringEscapeUtils.escapeHtml4(message)
            : new Handlebars.SafeString(message);
    }
}
