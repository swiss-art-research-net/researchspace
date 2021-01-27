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

import java.util.Optional;

import org.apache.shiro.authz.SimpleRole;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.context.session.SessionStore;
import org.pac4j.core.profile.UserProfile;
import org.researchspace.security.ShiroTextRealm;
import org.pac4j.oidc.authorization.generator.KeycloakRolesAuthorizationGenerator;

public class AuthorithationGenerator extends KeycloakRolesAuthorizationGenerator {

    private String defaultRole;
    private ShiroTextRealm textRealm;

    public AuthorithationGenerator() {
    }

    public void setTextRealm(ShiroTextRealm realm) {
        this.textRealm = realm;
    }

    @Override
    public Optional<UserProfile> generate(WebContext arg0, SessionStore sessionStore, UserProfile profile) {
        super.generate(arg0, sessionStore, profile);
        profile.addRole(defaultRole);
        profile.getRoles().forEach(role -> this.addPermissions(profile, role));
        return Optional.of(profile);
    }

    private void addPermissions(UserProfile profile, String role) {
        SimpleRole shiroRole = this.textRealm.getRoles().get(role);
        if (shiroRole != null) {
            shiroRole.getPermissions().forEach(p -> {
                    profile.addPermission(p.toString());
                });
        }
    }

    public void setDefaultRole(String defaultRole) {
        this.defaultRole = defaultRole;
    }
}
