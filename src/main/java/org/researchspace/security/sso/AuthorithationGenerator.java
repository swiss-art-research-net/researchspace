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

import org.pac4j.core.context.WebContext;
import org.pac4j.oauth.profile.OAuth20Profile;
import org.researchspace.security.ShiroTextRealm;

public class AuthorithationGenerator
        implements org.pac4j.core.authorization.generator.AuthorizationGenerator<OAuth20Profile> {

    private String defaultRole = "guest";
    private ShiroTextRealm textRealm;

    public AuthorithationGenerator() {
    }

    public void setTextRealm(ShiroTextRealm realm) {
        this.textRealm = realm;
    }

    @Override
    public OAuth20Profile generate(WebContext arg0, OAuth20Profile profile) {
        profile.addRole(defaultRole);

        this.textRealm.getRoles().get(defaultRole).getPermissions().forEach(p -> {
            profile.addPermission(p.toString());
        });
        return profile;
    }

    public void setDefaultRole(String defaultRole) {
        this.defaultRole = defaultRole;
    }
}
