package org.researchspace.rest.endpoint;

import javax.inject.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.*;

import java.util.Optional;

/**
 * Minimal endpoint to store/retrieve per-user UI preferences in the HttpSession.
 *
 * This endpoint intentionally does NOT require authentication so that anonymous users
 * can still set a session-level preference (the session cookie will be created).
 * If shiro configuration forces login for /rest/*, then:
 *  - open this particular path in shiro.ini (recommended), or
 *  - annotate with @RequiresAuthentication (but then client must login first).
 */
@Path("user/preferences")
@Singleton
public class UserPreferencesEndpoint {

    private static final String SESSION_ATTR_NAME = "__userPreferredLanguage__";

    public static class LanguagePayload {
        public String language;
    }

    /**
     * GET /rest/user/preferences/language
     */
    @GET
    @Path("language")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPreferredLanguage(@Context HttpServletRequest request) {
        String lang = resolveFromRequest(request).orElse("en");
        return Response.ok().entity(new LanguagePayload() {{ language = lang; }}).build();
    }

    /**
     * PUT /rest/user/preferences/language
     * Expects JSON body: { "language": "de" }
     * Stores in HttpSession attribute for subsequent requests.
     */
    @PUT
    @Path("language")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response setPreferredLanguage(@Context HttpServletRequest request, LanguagePayload payload) {
        if (payload == null || payload.language == null || payload.language.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing language").build();
        }
        String lang = payload.language.trim();

        // store in session (create session if none)
        HttpSession session = request.getSession(true);
        session.setAttribute(SESSION_ATTR_NAME, lang);

        // Also return the stored value
        LanguagePayload out = new LanguagePayload();
        out.language = lang;
        // also set a cookie so subsequent requests (and servers that only look at cookies)
        // can read the preferred language; JS-accessible cookie (HttpOnly=false) if needed
        // path=/, max-age=1 year, httpOnly=false
        NewCookie cookie = new NewCookie(
                "preferredLanguage",
                lang,
                "/",
                null,
                NewCookie.DEFAULT_VERSION,
                null,
                365 * 24 * 60 * 60,
                false);
        return Response.ok().cookie(cookie).entity(out).build();
    }

    /**
     * Try to resolve language from session first, then cookie.
     */
    private Optional<String> resolveFromRequest(HttpServletRequest request) {
        if (request == null) return Optional.empty();

        // session
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                Object o = session.getAttribute(SESSION_ATTR_NAME);
                if (o instanceof String && !((String) o).trim().isEmpty()) {
                    return Optional.of(((String) o).trim());
                }
            }
        } catch (Exception ignored) {}

        // permissive session fallback names
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                Object o = session.getAttribute("preferredLanguage");
                if (o instanceof String && !((String) o).trim().isEmpty()) {
                    return Optional.of(((String) o).trim());
                }
            }
        } catch (Exception ignored) {}

        // cookie
        try {
            javax.servlet.http.Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (javax.servlet.http.Cookie c : cookies) {
                    String name = c.getName();
                    if ("preferredLanguage".equals(name)) {
                        String v = c.getValue();
                        if (v != null && !v.trim().isEmpty()) {
                            return Optional.of(v.trim());
                        }
                    }
                }
            }
        } catch (Exception ignored) {}

        return Optional.empty();
    }
}
