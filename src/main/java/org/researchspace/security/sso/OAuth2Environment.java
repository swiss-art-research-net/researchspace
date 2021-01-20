/**
 * ResearchSpace Copyright (C) 2020, © Trustees of the British Museum
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

package org.researchspace.security.sso;

import java.io.InputStream;

import javax.inject.Inject;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.config.Ini;
import org.researchspace.config.Configuration;
import org.researchspace.security.SecurityConfigRecord;
import org.researchspace.security.SecurityConfigType;
import org.researchspace.security.ShiroTextRealm;

public class OAuth2Environment extends SSOEnvironment {
    private static final Logger logger = LogManager.getLogger(OAuth2Environment.class);

    @Inject
    public OAuth2Environment(Configuration config, ShiroTextRealm textRealm) {
        super(config, textRealm);
    }

    @Override
    protected Ini getDefaultIni() {
        SecurityConfigRecord record = config.getEnvironmentConfig()
                .getSecurityConfig(SecurityConfigType.OauthParameters);

        Ini ini = new Ini();
        try (InputStream stream = record.readStream()) {
            ini.load(stream);
        } catch (Exception e) {
            logger.error("OAuth2 is enabled but shiro-sso-oauth-params.ini is missing.");
            System.exit(1);
        }
        return ini;
    }

    @Override
    protected Ini getFrameworkIni() {
        return Ini.fromResourcePath("classpath:org/researchspace/security/sso/shiro-sso-oauth-default.ini");
    }
}
