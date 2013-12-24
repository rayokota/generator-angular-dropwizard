package <%= packageName %>;

import <%= packageName %>.config.*;
import <%= packageName %>.model.*;
import <%= packageName %>.resources.*;
import <%= packageName %>.store.*;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.common.base.Optional;
import com.yammer.dropwizard.assets.AssetsBundle;
import com.yammer.dropwizard.config.Bootstrap;
import com.yammer.dropwizard.config.Environment;
import com.yammer.dropwizard.db.DatabaseConfiguration;
import com.yammer.dropwizard.hibernate.HibernateBundle;
import com.yammer.dropwizard.json.ObjectMapperFactory;
import com.yammer.dropwizard.Service;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class <%= _.capitalize(baseName) %>Service extends Service<<%= _.capitalize(baseName) %>Configuration> {
    private static final Logger LOG = LoggerFactory.getLogger(<%= _.capitalize(baseName)  %>Service.class);

    public static void main(String[] args) throws Exception {
        new <%= _.capitalize(baseName)  %>Service().run(args);
    }

    private final HibernateBundle<<%= _.capitalize(baseName) %>Configuration> hibernateBundle = new HibernateBundle<<%= _.capitalize(baseName) %>Configuration>(
            <% _.each(entities, function (entity) { %>
            <%= _.capitalize(entity.name) %>.class,<% }); %>
            Void.class
        ) {
        @Override
        public DatabaseConfiguration getDatabaseConfiguration(<%= _.capitalize(baseName) %>Configuration configuration) {
            return configuration.getDatabaseConfiguration();
        }
    };

    @Override
    public void initialize(Bootstrap<<%= _.capitalize(baseName)  %>Configuration> bootstrap) {
        bootstrap.setName("<%= baseName %>");
        bootstrap.addBundle(new AssetsBundle("/assets/app/", "/", "index.html"));
        bootstrap.addBundle(hibernateBundle);
        ObjectMapperFactory mapperFactory = bootstrap.getObjectMapperFactory();
        mapperFactory.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public void run(<%= _.capitalize(baseName) %>Configuration configuration,
                    Environment environment) throws Exception {
        <% _.each(entities, function (entity) { %>
        environment.addResource(new <%= _.capitalize(entity.name) %>Resource(
            new <%= _.capitalize(entity.name) %>DAO(hibernateBundle.getSessionFactory())));<% }); %>
    }
}
