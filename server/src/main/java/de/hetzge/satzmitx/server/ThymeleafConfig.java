package de.hetzge.satzmitx.server;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

public class ThymeleafConfig {

	public static TemplateEngine templateEngine(ITemplateResolver templateResolver) {
		final TemplateEngine templateEngine = new TemplateEngine();
		templateEngine.addTemplateResolver(templateResolver);
		return templateEngine;
	}

	public static ITemplateResolver templateResolver(TemplateMode templateMode, String prefix, String suffix) {
		final ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver(Thread.currentThread().getContextClassLoader());
		templateResolver.setTemplateMode(templateMode);
		templateResolver.setPrefix(prefix);
		templateResolver.setSuffix(suffix);
		templateResolver.setCharacterEncoding("UTF-8");
		return templateResolver;
	}

}