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

import java.io.IOException;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;
import org.researchspace.config.Configuration;
import org.researchspace.servlet.filter.CorsFilter;
import org.researchspace.servlet.filter.MDCFilter;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.google.inject.name.Named;

/**
 * Custom extension of shiro's default to disable redirect caching of the login
 * url by setting the respective HTTP response header.
 * 
 *
 * @author Johannes Trame <jt@metaphacts.com>
 */
@Singleton
public class FormAuthenticationFilter extends org.apache.shiro.web.filter.authc.FormAuthenticationFilter {
    private final static Logger logger = LogManager.getLogger(FormAuthenticationFilter.class);

    @Inject
    private Configuration config;

    @Override
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
        // if CORS is enabled we can't request authentication for OPTIONS requests
        // because browsers don't send basic auth headers for pre-flight requests
        if (CorsFilter.isCorsPreFlightRequest(config, request)) {
            return true;
        } else {
            return super.isAccessAllowed(request, response, mappedValue);
        }
    }

    @Override
    protected void redirectToLogin(ServletRequest request, ServletResponse response) throws IOException {
        // set header to force e.g. Safari not do cache the resulting redirect
        // header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate");
        if (response instanceof HttpServletResponse) {
            HttpServletResponse httpResponse = ((HttpServletResponse) response);
            httpResponse.setHeader("cache-control", "max-age=0, no-cache, no-store, must-revalidate");
        }

        super.redirectToLogin(request, response);
    }

    @Inject
    @Override
    public void setLoginUrl(@Named("authc.loginUrl") String loginUrl) {
        super.setLoginUrl(loginUrl);
    }

    @Override
    protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request,
            ServletResponse response) throws Exception {
        /*
         * Even though we have the global {@link MDCFilter}, we need to call and inject
         * the MDC statically, since the FormAuthenticationFilter will be invoked
         * before.
         */
        MDCFilter.wrapIntoMDC(() -> logger.debug("User \"{}\" authenticated successfully.", subject.getPrincipal()),
                (HttpServletRequest) request);

        // initialize the authorization information inside the realm
        // => note: this is not actually a permission check, but rather a means
        // for initializing the cache
        subject.isPermitted("authorization-init");

        return super.onLoginSuccess(token, subject, request, response);
    }

}