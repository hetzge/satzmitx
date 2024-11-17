package de.hetzge.satzmitx.server;

import java.util.List;
import java.util.Map;

import org.pac4j.core.client.Clients;
import org.pac4j.core.config.Config;
import org.pac4j.core.context.HttpConstants;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.exception.http.HttpAction;
import org.pac4j.core.matching.matcher.PathMatcher;
import org.pac4j.core.profile.UserProfile;
import org.pac4j.core.profile.factory.ProfileManagerFactory;
import org.pac4j.javalin.CallbackHandler;
import org.pac4j.javalin.JavalinContextFactory;
import org.pac4j.javalin.JavalinFrameworkParameters;
import org.pac4j.javalin.JavalinHttpActionAdapter;
import org.pac4j.javalin.SecurityHandler;
import org.pac4j.jee.context.session.JEESessionStoreFactory;
import org.pac4j.oauth.client.TwitterClient;
import org.thymeleaf.templatemode.TemplateMode;

import io.javalin.Javalin;
import io.javalin.http.ForbiddenResponse;
import io.javalin.http.UnauthorizedResponse;
import io.javalin.rendering.template.JavalinThymeleaf;

public class Main {

	public static void main(String[] args) {

		final TwitterClient twitterClient = new TwitterClient("j0DsNZoNIbQrhInAnWkhxl18K", "owKjy92s9fQvzmIA4kD0EwjvKRIPRsMV8rfxzAEP4WXfJg9tJJ");
//		twitterClient.getConfiguration().setScope("openid sub");
		final Clients clients = new Clients("http://localhost:8080/callback", twitterClient);
		final Config config = new Config(clients);
//		config.addAuthorizer("admin", new RequireAnyRoleAuthorizer("ROLE_ADMIN"));
//		config.addAuthorizer("custom", new CustomAuthorizer());
		config.addMatcher("excludedPath", new PathMatcher().excludeRegex("^/facebook/notprotected$"));
		config.setHttpActionAdapter(new ExampleHttpActionAdapter());
		config.setWebContextFactory(JavalinContextFactory.INSTANCE);
		config.setSessionStoreFactory(JEESessionStoreFactory.INSTANCE);
		config.setProfileManagerFactory(ProfileManagerFactory.DEFAULT);

		final CallbackHandler callbackHandler = new CallbackHandler(config, null, true);
		Javalin.create(c -> {
			c.fileRenderer(new JavalinThymeleaf(ThymeleafConfig.templateEngine(ThymeleafConfig.templateResolver(TemplateMode.HTML, null, null))));

//			c.staticFiles.add("web");
			c.staticFiles.enableWebjars();
		})
//				.get("/", ctx -> index(ctx, config))
				.get("/callback", callbackHandler)
				.post("/callback", callbackHandler)
				.before("/twitter", new SecurityHandler(config, "TwitterClient"))
				.get("/twitter", ctx -> {
					ctx.result("Hello");
					final JavalinFrameworkParameters parameters = new JavalinFrameworkParameters(ctx);
					final List<UserProfile> profiles = config.getProfileManagerFactory().apply(
							config.getWebContextFactory().newContext(parameters),
							config.getSessionStoreFactory().newSessionStore(parameters)).getProfiles();
					for (final UserProfile profile : profiles) {
						System.out.println("Username: " + profile.getUsername());
					}
					ctx.render("index.html", Map.ofEntries(Map.entry("name", "test123")));
				})
				.get("/form/submit", ctx -> {
					ctx.result("aaa");
				})
				.start();

	}

	public static class ExampleHttpActionAdapter extends JavalinHttpActionAdapter {
		@Override
		public Void adapt(HttpAction action, WebContext context) {
			switch (action.getCode()) {
			case HttpConstants.UNAUTHORIZED:
				throw new UnauthorizedResponse("Unauthorized - Please Login first");
			case HttpConstants.FORBIDDEN:
				throw new ForbiddenResponse("Forbidden - You don't have access to this resource");
			default:
				return super.adapt(action, context);
			}
		}
	}

}
