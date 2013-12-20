package <%= packageName %>.client;

import com.sun.jersey.api.client.Client;
import com.yammer.dropwizard.client.JerseyClientBuilder;
import com.yammer.dropwizard.client.JerseyClientConfiguration;
import com.yammer.dropwizard.json.ObjectMapperFactory;
import com.yammer.dropwizard.util.Duration;

import java.net.URI;
import java.util.concurrent.Executors;

public class <%= _.capitalize(baseName) %>Client {

    private final Client client;
    private final JerseyClientBuilder clientBuilder;
    private final URI root;

    public <%= _.capitalize(baseName) %>Client(Client client, URI root) {
        this.client = client;
        this.clientBuilder = null;
        this.root = root;
    }

    public <%= _.capitalize(baseName) %>Client(JerseyClientBuilder clientBuilder, URI root) {
        this.client = null;
        this.clientBuilder = clientBuilder;
        this.root = root;
    }

    public String getExample() {
        return getClient().resource(root).path("/v1/example/yo").queryParam("bar", "dude").get(String.class);
    }

    private Client getClient() {
        return client != null ? client : buildClient(clientBuilder);
    }

    private static Client buildClient(JerseyClientBuilder clientBuilder) {
        final JerseyClientConfiguration jerseyConfig = new JerseyClientConfiguration();
        jerseyConfig.setConnectionTimeout(Duration.milliseconds(500));
        jerseyConfig.setKeepAlive(Duration.minutes(5));
        jerseyConfig.setMaxConnections(2048);
        jerseyConfig.setMaxConnectionsPerRoute(2048);
        jerseyConfig.setTimeout(Duration.hours(1));
        jerseyConfig.setTimeToLive(Duration.minutes(5));

        final JerseyClientBuilder builder = clientBuilder != null ? clientBuilder : new JerseyClientBuilder();

        return builder
            .using(Executors.newSingleThreadExecutor(), new ObjectMapperFactory().build())
            .using(jerseyConfig).build();
    }
}
