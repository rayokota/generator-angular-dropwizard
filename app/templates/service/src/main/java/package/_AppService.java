package <%= packageName %>;

import <%= packageName %>.config.*;
<% if (entities.length > 0) { %>import <%= packageName %>.daos.*;<% } %>
<% if (entities.length > 0) { %>import <%= packageName %>.models.*;<% } %>
<% if (entities.length > 0 || resources.length > 0) { %>import <%= packageName %>.resources.*;<% } %>
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.common.base.Optional;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class <%= _.capitalize(baseName) %>Service extends Application<<%= _.capitalize(baseName) %>Configuration> {
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
        public DataSourceFactory getDataSourceFactory(<%= _.capitalize(baseName) %>Configuration configuration) {
            return configuration.getDataSourceFactory();
        }
    };

    @Override
    public String getName() {
        return "<%= baseName %>";
    }

    @Override
    public void initialize(Bootstrap<<%= _.capitalize(baseName)  %>Configuration> bootstrap) {
        bootstrap.addBundle(new AssetsBundle("/assets/app/", "/", "index.html"));
        bootstrap.addBundle(hibernateBundle);
        ObjectMapper mapper = bootstrap.getObjectMapper();
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public void run(<%= _.capitalize(baseName) %>Configuration configuration,
                    Environment environment) throws Exception {
        environment.jersey().setUrlPattern("/<%= baseName %>/*");
        <% _.each(resources, function (resource) { %>
        environment.jersey().register(new <%= _.capitalize(resource.name) %>Resource());<% }); %>
        <% _.each(entities, function (entity) { %>
        environment.jersey().register(new <%= _.capitalize(entity.name) %>Resource(
            new <%= _.capitalize(entity.name) %>DAO(hibernateBundle.getSessionFactory())));<% }); %>
    }
}
