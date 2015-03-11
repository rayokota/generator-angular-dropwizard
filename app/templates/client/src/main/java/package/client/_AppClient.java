package <%= packageName %>.client;

import com.codahale.metrics.MetricRegistry;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.ws.rs.client.Client;
import io.dropwizard.client.JerseyClientBuilder;
import io.dropwizard.client.JerseyClientConfiguration;
import io.dropwizard.util.Duration;

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
        return getClient().target(root).path("/v1/example/yo").queryParam("bar", "dude").request().get(String.class);
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

        final JerseyClientBuilder builder = clientBuilder != null ? clientBuilder : new JerseyClientBuilder(new MetricRegistry());

        return builder
            .using(Executors.newSingleThreadExecutor(), new ObjectMapper())
            .using(jerseyConfig).build("<%= baseName %>Client");
    }
}
