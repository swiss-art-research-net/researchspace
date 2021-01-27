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

import org.researchspace.config.Configuration;

public enum SecurityConfigType {
    ShiroConfig("shiroConfig", "shiro.ini"),
    ShiroLDAPConfig("shiroLDAPConfig", "shiro-ldap.ini"),
    OauthParameters("oauthParameters", "shiro-sso-oauth-params.ini"),
    keycloak("keycloakParameters", "shiro-sso-keycloak-params.ini"),
    SamlParameters("samlParameters", "shiro-sso-saml-params.ini"),
    SsoAuthConfigOverride("ssoFactorAuthOverride", "shiro-sso.ini"),
    SsoUsersConfig("ssoUserConfig", "shiro-sso-users.ini");

    private String paramKey;
    private String fileName;

    SecurityConfigType(String paramKey, String fileName) {
        this.paramKey = paramKey;
        this.fileName = fileName;
    }

    public String getParamKey() {
        return paramKey;
    }

    public String getFileName() {
        return fileName;
    }

    public String getDefaultPath() {
        return Configuration.getConfigBasePath() + fileName;
    }
}
