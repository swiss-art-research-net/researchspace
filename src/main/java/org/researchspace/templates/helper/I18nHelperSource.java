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

import javax.inject.Inject;

import org.researchspace.templates.TemplateContext;
import org.researchspace.config.Configuration;

import java.util.Locale;
import java.util.MissingResourceException;
import java.util.ResourceBundle;
import java.text.MessageFormat;
import com.github.jknack.handlebars.Options;
import org.apache.commons.text.StringEscapeUtils;
import com.github.jknack.handlebars.Handlebars;


public class I18nHelperSource {

    private final Configuration config;
    public static final String DEFAULT_BUNDLE = "messages";

    @Inject
    public I18nHelperSource(Configuration config) {
        this.config = config;
    }

    public String getDefaultPreferredLanguage() {
        return config.getUiConfig().getPreferredLanguages().get(0);
    }

    public CharSequence i18n(final String key, final Options options) {
        TemplateContext context = (TemplateContext) options.context.model();
        String language = context.getPreferredLanguage().orElse(getDefaultPreferredLanguage());
        String bundleName = options.hash("bundle", DEFAULT_BUNDLE);

        Locale locale = Locale.forLanguageTag(language);
        ResourceBundle bundle;

        try {
            bundle = ResourceBundle.getBundle(bundleName, locale, getClass().getClassLoader());
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
