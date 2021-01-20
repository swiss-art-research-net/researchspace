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

import org.apache.shiro.util.Factory;
import org.pac4j.oauth.client.OAuth20Client;
import org.pac4j.oauth.config.OAuth20Configuration;
import org.pac4j.oauth.profile.OAuth20Profile;
import org.pac4j.oauth.profile.creator.OAuth20ProfileCreator;

public class OpenIdProfileCreatorFactory implements Factory<OAuth20ProfileCreator<OAuth20Profile>> {
    private OAuth20Configuration config;
    private OAuth20Client<OAuth20Profile> client;

    @Override
    public OAuth20ProfileCreator<OAuth20Profile> getInstance() {
        return new OAuth20ProfileCreator<OAuth20Profile>(this.config, this.client);
    }

    public void setConfig(OAuth20Configuration config) {
        this.config = config;
    }

    public void setClient(OAuth20Client<OAuth20Profile> client) {
        this.client = client;
    }
}
