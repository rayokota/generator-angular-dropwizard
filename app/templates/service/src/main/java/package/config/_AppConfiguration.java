package <%= packageName %>.config;

import com.yammer.dropwizard.config.Configuration;
import com.yammer.dropwizard.db.DatabaseConfiguration;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class <%= _.capitalize(baseName) %>Configuration extends Configuration {

    @NotNull
    @JsonProperty
    private String sampleProperty;

    @Valid
    @NotNull
    @JsonProperty
    private DatabaseConfiguration database = new DatabaseConfiguration();

    public String getSampleProperty() {
        return sampleProperty;
    }

    public DatabaseConfiguration getDatabaseConfiguration() {
        return database;
    }

    public void setDatabaseConfiguration(DatabaseConfiguration database) {
        this.database = database;
    }
}
