package <%= packageName %>.resources;

import com.codahale.metrics.annotation.Timed;
import io.dropwizard.jersey.params.BooleanParam;
import io.dropwizard.jersey.params.DateTimeParam;
import io.dropwizard.jersey.params.IntParam;
import io.dropwizard.jersey.params.LongParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/<%= name %>")
public class <%= _.capitalize(name) %>Resource {

    private static final Logger LOG = LoggerFactory.getLogger(<%= _.capitalize(name) %>Resource.class);

    <% _.each(methods, function (method) { %>
    @Path("<%= method.methodPath %>")
    @<%= method.methodType %>
    @Produces(MediaType.APPLICATION_JSON)
    @Timed 
    public String <%= method.methodName %>(
        <% var p1 = _.map(uriTemplateParts(method.methodPath), function (param) { return '@PathParam("' + param + '") String ' + param; });
           var p2 = _.map(method.formParams, function (param) { return '@FormParam("' + param + '") String ' + param; }); %>
        <%= p1.concat(p2).join(',\n        ') %>
        ) {
        StringBuilder sb = new StringBuilder();
        sb.append("Received parameters:\n");
        <% _.each(uriTemplateParts(method.methodPath).concat(method.formParams), function (param) { %>
        sb.append("<%= param %>=");
        sb.append(<%= param %>);
        sb.append("\n");
        <% }); %>
        return sb.toString();
    }
    <% }); %>
}
