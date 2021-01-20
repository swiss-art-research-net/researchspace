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

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import javax.inject.Provider;
import javax.inject.Singleton;
import javax.servlet.Filter;
import javax.servlet.ServletContext;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.config.ConfigurationException;
import org.apache.shiro.guice.web.ShiroWebModule;
import org.apache.shiro.web.env.WebEnvironment;
import org.apache.shiro.web.mgt.WebSecurityManager;
import org.pac4j.core.authorization.generator.AuthorizationGenerator;
import org.pac4j.oauth.client.OAuth20Client;
import org.researchspace.cache.CacheManager;
import org.researchspace.config.Configuration;
import org.researchspace.security.sso.OAuth2Environment;
import org.researchspace.security.sso.SSOCallbackFilter;
import org.researchspace.security.sso.SSOEnvironment;
import org.researchspace.security.sso.SSOLogoutFilter;
import org.researchspace.security.sso.SSOSecurityFilter;

import io.buji.pac4j.subject.Pac4jSubjectFactory;

import com.google.common.collect.Lists;
import com.google.inject.Injector;
import com.google.inject.Key;
import com.google.inject.binder.AnnotatedBindingBuilder;
import com.google.inject.name.Names;

/**
 * @author Artem Kozlov {@literal <ak@metaphacts.com>}
 * @author Johannes Trame {@literal <jt@metaphacts.com>}
 */
public class ShiroGuiceModule extends ShiroWebModule {

    private static Logger logger = LogManager.getLogger(ShiroGuiceModule.class);

    public static final String LOGIN_PATH = "/login";

    private Injector coreInjector;
    private Provider<Configuration> config;

    public ShiroGuiceModule(ServletContext servletContext, Injector corePlatformInjector) {
        super(servletContext);
        this.coreInjector = corePlatformInjector;
        this.config = this.coreInjector.getProvider(org.researchspace.config.Configuration.class);
    }

    @Override
    protected void configureShiroWeb() {
        bindConstant().annotatedWith(Names.named("shiro.successUrl")).to("/");

        // note: we can't set the session timeout here, but need to do that using the
        // PlatformSecurityManager,
        // which brings its own session manager (in which we change the global timeout)
        addFilterChain("/assets/no_auth/**", ANON);

        // these need to be anon access for tableau
        addFilterChain("/assets/api-commons-*-bundle.js", ANON);
        addFilterChain("/assets/tableau-*-bundle.js", ANON);
        addFilterChain("/tableau", ANON);
        addFilterChain("/tableau/isAnonymousEnabled", ANON);

        configureRealmBindings(config.get());

        addFilterChain("/favicon.ico", ANON);

        Key<? extends Filter>[] filters = null;
        try {
            filters = getFiltersFromConfig();
            logger.info("Adding authentication filters to filter chain: " + Arrays.toString(filters));
        } catch (Exception e) {
            logger.debug("Critical error while configuring the shiro authentication filter: " + e.getMessage());
            /*
             * STOP SERVLET CONFIGURATION AND START-UP If there are exceptions in getting
             * the (correct order of) filters from the config, this might be a serious
             * security issue and such we prevent from further start-up.
             */
            System.exit(78); // 78 = /* configuration error */
        }

        addFilterChain("/**", filters);
    }



    protected void configureRealmBindings(Configuration config) {
        if (config.getEnvironmentConfig().getSecurityConfig(SecurityConfigType.ShiroLDAPConfig).exists()) {
            addLocalLogin(config);
            bindRealm().toProvider(LDAPRealmProvider.class).in(Singleton.class);
            addFilterChain("/logout", LOGOUT);
        } else if (config.getEnvironmentConfig().getSecurityConfig(SecurityConfigType.OauthParameters).exists()) {
            bindRealm().to(io.buji.pac4j.realm.Pac4jRealm.class).in(Singleton.class);
            bind(SSOEnvironment.class).to(OAuth2Environment.class);
            bind(WebEnvironment.class).to(OAuth2Environment.class);
            bind(OAuth2Environment.class).in(Singleton.class);
            addFilterChain("/sso/callback", ShiroFilter.ssoCallback.getFilterKey());
        } else {
            bindLocalUsersRealm();
            addDefaultLoginPage();
            addFilterChain("/logout", LOGOUT);
        }
    }

    @Override
    protected void bindWebEnvironment(AnnotatedBindingBuilder<? super WebEnvironment> bind) {
        if (this.config.get().getEnvironmentConfig().getSecurityConfig(SecurityConfigType.OauthParameters).exists()) {
            bind.to(OAuth2Environment.class);
        } else {
            super.bindWebEnvironment(bind);
        }
    }

    protected void addDefaultLoginPage() {
        bindConstant().annotatedWith(Names.named("authc.loginUrl")).to(LOGIN_PATH);
        addFilterChain(LOGIN_PATH, Key.get(FormLogoutLoginFilter.class), ShiroFilter.authc.getFilterKey());
    }

    protected void addLocalLogin(Configuration config) {
        if (config.getEnvironmentConfig().isEnableLocalUsers()) {
            bindLocalUsersRealm();
        }

        addDefaultLoginPage();
    }

    protected void bindLocalUsersRealm() {
        bindRealm().toProvider(ShiroRealmProvider.class).in(Singleton.class);
    }

    @Override
    protected void bindWebSecurityManager(final AnnotatedBindingBuilder<? super WebSecurityManager> bind) {
        try {
            bind.toConstructor(PlatformSecurityManager.class.getConstructor(Collection.class, Configuration.class,
                    CacheManager.class)).asEagerSingleton();
        } catch (NoSuchMethodException e) {
            throw new ConfigurationException("This is a serious configuration error while setting up the ShiroModule",
                    e);
        }
    }

    private Key<? extends Filter>[] getFiltersFromConfig() {
        List<Key<? extends Filter>> filters = Lists.newArrayList();
        for (String strFilter : this.coreInjector.getInstance(Configuration.class).getEnvironmentConfig()
                .getShiroAuthenticationFilter()) {
            try {
                ShiroFilter filterKey = ShiroFilter.valueOf(strFilter);
                filters.add(filterKey.getFilterKey());
            } catch (Exception e) {
                throw new IllegalStateException("Authentication filter " + strFilter
                        + " no known. Please choose any of: " + Lists.newArrayList(ShiroFilter.values()));
            }
        }
        if (filters.isEmpty()) {
            throw new IllegalStateException("No authentication filter specified. Please choose any of: "
                    + Lists.newArrayList(ShiroFilter.values()));
        } else if (filters.size() == 1 && filters.get(0) == ShiroFilter.authcBasic.getFilterKey()) {
            throw new IllegalStateException(
                    "Only \"authcBasic\" filter specified. \"authcBasic\" filter MUST be combined with at least another (session based) authentication filter.");
        } else if (filters.contains(ShiroFilter.authcBasic.getFilterKey())
                && filters.get(0) != ShiroFilter.authcBasic.getFilterKey()) {
            // here we only log a warning, this is actually not an critical error, however,
            // certainly not what has been intended
            logger.warn("\"authcBasic\" filter should be applied as first filter in the filter chain.");
        }

        @SuppressWarnings("unchecked")
        Key<? extends Filter>[] ar = new Key[filters.size()];

        return filters.toArray(ar);
    }

    public enum ShiroFilter {
        authc(FormAuthenticationFilter.class), anon(AnonymousUserFilter.class),
        authcBasic(OptionalBasicAuthFilter.class),

        oauth2(SSOSecurityFilter.class), saml2(SSOSecurityFilter.class), sso(SSOSecurityFilter.class),
        ssoLogout(SSOLogoutFilter.class), ssoCallback(SSOCallbackFilter.class);

        private Key<? extends javax.servlet.Filter> filterKey;

        ShiroFilter(Class<? extends Filter> filterClass) {
            this.filterKey = Key.get(filterClass);
        }

        public Key<? extends Filter> getFilterKey() {
            return this.filterKey;
        }
    }
}
