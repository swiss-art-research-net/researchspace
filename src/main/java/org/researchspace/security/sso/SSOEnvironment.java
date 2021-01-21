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

package org.researchspace.security.sso;

import java.io.InputStream;
import java.util.Map;

import javax.inject.Inject;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.config.Ini;
import org.apache.shiro.web.env.IniWebEnvironment;
import org.researchspace.config.Configuration;
import org.researchspace.security.SecurityConfigRecord;
import org.researchspace.security.SecurityConfigType;
import org.researchspace.security.ShiroTextRealm;

/**
 * @author Artem Kozlov {@literal <ak@metaphacts.com>}
 */
public class SSOEnvironment extends IniWebEnvironment {
    private static final Logger logger = LogManager.getLogger(SSOEnvironment.class);

    private static final String USERS = "users";

    private SSOUsersRegistry users;
    protected Configuration config;
    protected ShiroTextRealm textRealm;

    @Inject
    public SSOEnvironment(Configuration config, ShiroTextRealm textRealm) {
        super();
        this.config = config;
        this.textRealm = textRealm;
        this.users = new SSOUsersRegistry(config);
    }

    @Override
    protected Map<String, Object> getDefaults() {
        Map<String, Object> defaults = super.getDefaults();
        defaults.put(USERS, users);
        return defaults;
    }

    @Override
    protected void configure() {
        super.configure();
        AuthorithationGenerator authGenerator = this.getObject("authGenerator", AuthorithationGenerator.class);
        authGenerator.setTextRealm(this.textRealm);
    }

    @Override
    protected Ini getDefaultIni() {
        String ssoVariant = this.config.getEnvironmentConfig().getSsoVariant();
        SecurityConfigType configType = SecurityConfigType.valueOf(ssoVariant);
        SecurityConfigRecord record = config.getEnvironmentConfig().getSecurityConfig(configType);

        Ini ini = new Ini();
        try (InputStream stream = record.readStream()) {
            ini.load(stream);
        } catch (Exception e) {
            logger.error("SSO is enabled but " + configType.getFileName()  + " is missing.");
            System.exit(1);
        }
        return ini;
    }

    @Override
    protected Ini getFrameworkIni() {
        return Ini.fromResourcePath(
                "classpath:org/researchspace/security/sso/shiro-sso-" + this.config.getEnvironmentConfig().getSsoVariant() + "-default.ini");
    }
}
